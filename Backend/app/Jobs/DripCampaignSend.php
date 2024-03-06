<?php

namespace App\Jobs;

use App\Mail\MyTrackedEmail;
use App\Mail\SendSmtpMail;
use App\Models\DomainTracking;
use App\Models\DripEmail;
use App\Models\Emails\DripCampaign;
use App\Models\Emails\DripSequence;
use App\Models\Emails\DripUrl;
use App\Models\Emails\EmailAccount;
use App\Models\Emails\EmailListSubscriber;
use App\Models\Emails\TimeFilter;
use App\Models\SubscribeLink;
use App\Models\tenant_db_name;
use App\Repositories\CampaignRepository;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Mail\MailManager;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Symfony\Component\Mailer\Transport\Smtp\SmtpTransport;

class DripCampaignSend implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    public $campaign_id, $subscriber_id, $tenet_id,$returnValue,$sequence_id,$domain,$time_zone;

    public function __construct($campaign_id, $subscriber_id, $tenet_id, $sequence_id,$time_zone)
    {
        $this->campaign_id      = $campaign_id;
        $this->subscriber_id    = $subscriber_id;
        $this->tenet_id         = $tenet_id;
        $this->sequence_id      = $sequence_id;
        $this->time_zone        = $time_zone;
    }

    public function handle()
    {
        date_default_timezone_set($this->time_zone);
        Log::info('timezone:',  ['timezone' => date_default_timezone_get()]);


        $tracking = DomainTracking::first();
        if ($tracking)
        {
            $this->domain = $tracking->domain;
        }
        $db_count = tenant_db_name::where('tenant_id', $this->tenet_id)->first();

        if ($db_count){
            Config::set('tenancy.database.template_tenant_connection', $db_count->db_con_use);
            DB::purge('tenant');
            Config::set('database.connections.tenant.host', env('DB_HOST'));
            Config::set('database.connections.tenant.username', env('DB_USERNAME'));
            Config::set('database.connections.tenant.password', env('DB_PASSWORD'));
            Config::set('database.connections.tenant.database', $db_count->tenant_db);
            Config::set('database.default', 'tenant');
            DB::reconnect('tenant');
            // run campaing
            $this->runCampaign();
        }
    }

    public function runCampaign()
    {
        $cam = DripCampaign::find($this->campaign_id);
        $sequence = DripSequence::find($this->sequence_id);
        if(!$cam)
        {
            return false;
        }
        $repo           = new CampaignRepository();
        $email          = EmailListSubscriber::find($this->subscriber_id);
        $html           = $repo->parseUrl($cam->id,$cam->tracking,$sequence->sq_body,$this->domain,$email,$this->tenet_id,$this->sequence_id);
        $camp_smtp_id   = $cam->smtp_id;
        $smtp_id        = $email->id%sizeof($camp_smtp_id);
        $smtp_id        = $camp_smtp_id[$smtp_id];
        $send_info      = EmailAccount::find($smtp_id);
        $parsed_data    = $repo->changeUserInfo($email->other,$send_info->smtp_from_name,$sequence->sq_subject,$html);
        $subject        = $parsed_data['subject'];
        $html           = $parsed_data['html'];
        $link           = SubscribeLink::first();
        $link           = $link ? 'https://'.$link->url : '';
        $html           = str_replace('href="#unsubscribe"',"href=$link/api/drip_campaign/unsubscribe-email/$this->tenet_id/$email->list_id/$email->email",$html);

        // echo "<pre>";
        // print_r($html);die();

        if ($sequence->position > 1)
        {
            $subject = "Re: $subject";
        }

        return $this->sendEMail($send_info, $subject, $email, $html,$sequence,$email->list_id,$this->tenet_id);
    }

    public function sendEMail($sender_info, $subject, $subscriber_email, $html,$sequence,$list_id = null,$tenet_id=null)
    {
        if(!$sender_info)
        {
            return false;
        }
        $repo           = new CampaignRepository();
        $sender_name    = $sender_info->smtp_from_name;
        $sender_email   = $sender_info->smtp_from_email;
        $mailer         = $repo->configMail($sender_info);
        $camp           = DripCampaign::find($this->campaign_id);

        try {
            $others     = json_decode($subscriber_email->other,true);
            $first_name = arrayCheck('first_name',$others) ? @$others['first_name'] : @$others['First_name'];
            $last_name  = arrayCheck('last_name',$others) ? @$others['last_name'] : @$others['Last_name'];
            $name       = $first_name.' '.$last_name;

            $data = [
                'from'          => $sender_email,
                'from_mail'     => $sender_email,
                'from_name'     => $sender_name,
                'to_mail'       => $subscriber_email->email,
                'to_name'       => $name,
                'to'            => $subscriber_email->email,
                'list_id'       => $list_id,
                'subject'       => $subject,
                'tenet_id'      => $tenet_id,
                'content'       => $html,
                'campaign'      => $camp,
                'sender_id'     => $sender_info->id,
                'sequence_id'   => $sequence->id,
                'message_id'    => "$sequence->sq_uid@growtoro.com",
                'view'          => 'emails.drip_campaign_mail',
            ];

            $data['references'] = $repo->addReferences($sequence->position,$camp->id);
            Mail::mailer($mailer)->send(new MyTrackedEmail($data));

            DripEmail::create([
                'email_account_id'  => $sender_info->id,
                'list_id'           => $this->campaign_id,
                'subscriber_id'     => $subscriber_email->id,
                'subscriber_email'  => $subscriber_email->email,
                'sequence_id'       => $sequence->id,
            ]);

            return $camp->increment('total');
        } catch (\Exception $e) {
            Log::info('error',[$e]);
        }
    }
}
