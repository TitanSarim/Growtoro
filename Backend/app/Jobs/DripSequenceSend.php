<?php

namespace App\Jobs;

use App\Models\Emails\DripCampaign;
use App\Models\Emails\DripReply;
use App\Models\Emails\DripSequence;
use App\Models\Emails\DripSqUrl;
use App\Models\Emails\EmailAccount;
use App\Models\Emails\EmailListSubscriber;
use App\Models\Emails\TimeFilter;
use App\Models\tenant_db_name;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DripSequenceSend implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    public $campaign_id, $email, $hash, $tenet_id;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($campaign_id, $email, $hash, $tenet_id)
    {
        $this->campaign_id = $campaign_id;
        $this->email = $email;
        $this->hash = $hash;
        $this->tenet_id = $tenet_id;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $db_count = tenant_db_name::where('tenant_id', $this->tenet_id)->first();
        if ($db_count){
            Config::set('tenancy.database.template_tenant_connection', $db_count->db_con_use);
            DB::purge('tenant');
            Config::set('database.connections.tenant.host', env('DB_HOST'));
            Config::set('database.connections.tenant.username', env('DB_USERNAME'));
            Config::set('database.connections.tenant.password', env('DB_PASSWORD'));
            Config::set('database.connections.tenant.database', $db_count->tenancy_db_name);
            Config::set('database.default', 'tenant');
            DB::reconnect('tenant');
            // run campaing
            $this->runCampaign();
        }
    }

    public function runCampaign()
    {
        $cam = DripSequence::find($this->campaign_id);
        $drip_cmp = DripCampaign::find($cam->drip_id);
        if($cam){
            $email = EmailListSubscriber::where('subscriber_uid', $this->hash)->firt();
            $cp_url = DripSqUrl::where('sq_id', $cam->id)->get();
            if($drip_cmp->tracking && count($cp_url) > 0) {
                foreach ($cp_url as $value) {
                    $urls[] =  $value->destination;
                    $hash[] =  url('api/v1/public/'.$this->tenet_id.'/drip_sq_campaigns/click/'.$cam->dirp_uid.'/'.$this->hash.'/'.$value->hash);
                }
                array_push($urls,'[UNSUBSCRIBE]');
                array_push($hash,url('api/v1/public/'.$this->tenet_id.'/drip_sq_campaigns/unsubscribe/'.$cam->dirp_uid.'/'.$this->hash));
                $html =  str_replace($urls, $hash, $cam->sq_body);
            } else {
                $html = $cam->sq_body;
            }
            // email mark tag
            $mark_tag = ['[email]', '[first_name]', '[last_name]'];
            $user_details = json_decode($email->other);
            $user_first_name = isset($user_details->first_name)?$user_details->first_name:'';
            $user_last_name = isset($user_details->last_name)?$user_details->last_name:'';
            $marks_body = [$email->email, $user_first_name, $user_last_name];
            $html = str_replace($mark_tag, $marks_body, $html);
            // email mark tag end
            $html_with_open = $html.'<img width="1" height="1" src="'.url('api/v1/public/'.$this->tenet_id.'/drip_sq_campaigns/open/'.$cam->dirp_uid.'/'.$this->hash).'" alt="" />';

            $time = TimeFilter::where('drip_id', $cam->drip_id)->first();
            if ($time && $time->time_zone)
            {
                date_default_timezone_set($time->time_zone);
            }
            $this->addLogEmail($cam->log_file , $this->email."," .$this->hash.",".now().PHP_EOL);


            $drip_reply = DripReply::where('email', $this->email)->where('drip_id', $cam->drip_id)->first();
            if($drip_reply) {
                if($drip_cmp->stop_on_reply) {
                    return false;
                }
            }
            $this->sendEMail($drip_cmp->smtp_id, $cam->sq_subject, $drip_cmp->from_name, $drip_cmp->from_email, $this->email, $html_with_open);
        }
    }

    public function addLogEmail($log_file, $line)
    {
        file_put_contents($log_file, $line, FILE_APPEND);
    }

    public function sendEMail($smtp_id, $subject, $sender_name, $sender_email, $subscriber_email, $html)
    {
        $sender_info = EmailAccount::find($smtp_id);
        if(!$sender_info) {
            return;
        }
        $stmp =[
            'mail.mailers' => ['user_stmp'=> [
            'transport' => 'smtp',
            'host' => $sender_info->smtp_host_name,
            'port' => $sender_info->smtp_port,
            'encryption' => $sender_info->smtp_port == '465'?'ssl':'tls',
            'username' => $sender_info->smtp_user_name,
            'password' => $sender_info->smtp_password,
            'from' =>
            [
                //FIXME TWO BOTTOM LINES MUST BE GIVEN A DO OVER PROBABLY
                'address' => $sender_email,
                'name' => $sender_name,
            ],
            // 'mail.mailers.' . $temp_config_name . '.auth_mode' => 'smt',
            ]]
        ];
        config()->set($stmp);
        Mail::mailer('user_stmp')
        ->send([], [], function($m) use($subscriber_email, $subject, $sender_name, $sender_email, $html){
            $m->to($subscriber_email)
            ->from($sender_email, $sender_name)
            ->subject($subject)
            ->html($html);
        });
    }
}
