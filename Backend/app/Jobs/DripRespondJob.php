<?php

namespace App\Jobs;

use App\Models\Emails\DripCampaign;
use App\Models\Emails\DripReply;
use App\Models\Emails\EmailAccount;
use App\Models\tenant_db_name;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class DripRespondJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    public $tenant_id, $drip_id, $reply_id, $from_name, $from_email, $email_body;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($tenant_id, $drip_id, $reply_id, $from_name, $from_email, $email_body)
    {
        list($this->tenant_id, $this->drip_id, $this->reply_id, $this->from_name, $this->from_email, $this->email_body) = [$tenant_id, $drip_id, $reply_id, $from_name, $from_email, $email_body];
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $db_count = tenant_db_name::where('tenant_id', $this->tenant_id)->first();
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
            $this->checkEmails();
        }
    }

    public function checkEmails()
    {
        $cam = DripCampaign::find($this->drip_id);
        if($cam){
            $reply = DripReply::find($this->reply_id);
            if($reply) {
                $this->sendEMail($cam->smtp_id, $reply->subject, $this->from_name, $this->from_email, $reply->email, $this->email_body);
            }
        }
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
            ->replyTo($sender_email, $sender_name)
            ->subject($subject)
            ->html($html);
        });
    }
}
