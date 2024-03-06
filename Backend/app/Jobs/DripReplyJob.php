<?php

namespace App\Jobs;

use App\Models\Emails\DripCampaign;
use App\Models\Emails\DripReply;
use App\Models\Emails\EmailAccount;
use App\Models\Emails\EmailListSubscriber;
use App\Models\ReplyEmail;
use App\Models\Tenant;
use App\Models\tenant_db_name;
use App\Models\UniboxThread;
use Carbon\Carbon;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use PragmaRX\Google2FA\Support\Base32;
use Webklex\IMAP\Facades\Client;
use Webklex\PHPIMAP\Folder\Folder;
use Webklex\PHPIMAP\Message;
use Webklex\PHPIMAP\Attachment;
use Webklex\PHPIMAP\Support\MessageCollection;
use Webklex\PHPIMAP\Header\Header;
use Illuminate\Support\Facades\Storage;


class DripReplyJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, Batchable;

    public $tenet_id;
    public $imap_host_name;
    public $imap_user_name;
    public $imap_password;
    public $imap_port;
    public $campaign_id;
    public $camp_subject;
    public $list_id;
    public $smtp_id;
//    public $sequence_subject;
    public $timeout = 120; // Increase the timeout to 2 minutes

    public function __construct($tenet_id, $imap_host_name, $imap_user_name, $imap_password, $imap_port, $campaign_id, $camp_subject, $list_id, $smtp_id)
    {
        $this->tenet_id = $tenet_id;
        $this->imap_host_name = $imap_host_name;
        $this->imap_user_name = $imap_user_name;
        $this->imap_password = $imap_password;
        $this->imap_port = $imap_port;
        $this->campaign_id = $campaign_id;
        $this->camp_subject = $camp_subject;
        $this->list_id = $list_id;
        $this->smtp_id = $smtp_id;
//        $this->sequence_subject = $sequence_subject;
    }

    public function handle()
    {
        $db_count = tenant_db_name::where('tenant_id', $this->tenet_id)->first();
        Config::set('tenancy.database.template_tenant_connection', $db_count->db_con_use);
        DB::purge('tenant');
        Config::set('database.connections.tenant.host', env('DB_HOST'));
        Config::set('database.connections.tenant.username', env('DB_USERNAME'));
        Config::set('database.connections.tenant.password', env('DB_PASSWORD'));
        Config::set('database.connections.tenant.database', $db_count->tenant_db);
        Config::set('database.default', 'tenant');
        DB::reconnect('tenant');
        $this->findReply($db_count);
    }

    public function findReply($tenant)
    {
        $imap_host_name = $this->imap_host_name;
        $imap_user_name = $this->imap_user_name;
        $imap_password = $this->imap_password;
        $imap_port = $this->imap_port;
        $cam_id = $this->campaign_id;
        $subject = $this->camp_subject;
        $list_id = $this->list_id;
//        $sq_subject     = $this->sequence_subject;
        $sender_info = EmailAccount::find($this->smtp_id);

        $email_subscribers = EmailListSubscriber::whereHas('contacted')->whereHas('opens')->where('list_id', $list_id)->get();

        $client = Client::make([
            'host'     => $imap_host_name,
            'port'     => $imap_port,
            'encryption' => 'ssl',
            // 'validate_cert' => false,
            'username' => $imap_user_name,
            'password' => $imap_password,

        ]);

        $client->connect();

        if (!$client->isConnected()) {

            $sender_info->update(['is_connection_failed' => 1]);
            Log::info('connection failed', [$e->getMessage()]);
            return false;
        }

        if ($sender_info->last_search_time) {
            $searched_date = Carbon::parse($sender_info->last_search_time)->format('d F Y');
        } else {
            $searched_date = Carbon::parse($tenant->created_time)->format('d F Y');
        }

        foreach ($email_subscribers as $email)
        {
            $user_details       = json_decode($email->other);
            $mark_tag           = [];
            $marks_body         = [];

            foreach ($user_details as $key=>$tag)
            {
                $mark_tag[] = '{'.$key."}";
                $marks_body[] = $tag;
            }

            $replaced_subject   = str_replace($mark_tag, $marks_body, $subject);


            $folder = $client->getFolder('INBOX');
            // $dateString = '22-Dec-2023'; // Adjust format based on your IMAP server's requirements
            // $messages = $folder->search()->since($searched_date)->get();
            $messages = $folder->search()->since($searched_date)->text($replaced_subject)->get();

            foreach($messages as $message){

                $headers = $message->getHeader(); // Get an array of headers
                // Extract the reply email, subject, and body
                preg_match('~<([^{]*)>~i', $headers->get('from'), $match);

                if (array_key_exists(1,$match))
                {
                    $reply_emails     = $match[1];
                    $reply_subjects   = $message->getSubject();
                    $reply_bodies     = $message->getHTMLBody();
                    $msgnos           = $headers->get('msgno');
                    $uids             = $headers->get('uid');
                    $reply_created_at = $headers->get('date');
                    $msg_ids          = $headers->get('message_id');
                    $refs             = $headers->get('references') ?? null;//references
                    $in_replies_to    = $headers->get('in_reply_to') ?? null;
                }                

                $attachment_links= array();
                if ($message->hasAttachments()) {
                    
                    $attachments = $message->getAttachments();
                    
                    foreach ($attachments as $attachment) {
                        $filename = $attachment->getName();

                        $extension = pathinfo($filename, PATHINFO_EXTENSION);

                        // Allowed extensions (modify this array as needed)
                        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'doc', 'docx', 'xls', 'xlsx', 'pdf'];

                        if (in_array(strtolower($extension), $allowedExtensions)) {
                            
                            // Save the attachment
                            $file_path = public_path('attachments/') . $filename;

                            file_put_contents($file_path, $attachment->getContent());

                            // $img_url = asset('/attachments').'/'.$filename;

                            $img_url = '/attachments/'.$filename;

                            $attachment_links[] = $img_url;

                        }
                    }

                }

                $this->addReplyEmail($cam_id, $reply_emails, $reply_subjects, $reply_bodies,$sender_info->smtp_from_email,$msgnos,$uids,$reply_created_at,$msg_ids,$refs,$in_replies_to,$attachment_links);
            }
        }


        
        // Disconnect from the IMAP server
        $client->disconnect();
        $sender_info->update([
            'last_search_time' => now()
        ]);
    }


    public function findReplyOLd($tenant)
    {
        $imap_host_name = $this->imap_host_name;
        $imap_user_name = $this->imap_user_name;
        $imap_password = $this->imap_password;
        $imap_port = $this->imap_port;
        $cam_id = $this->campaign_id;
        $subject = $this->camp_subject;
        $list_id = $this->list_id;
//        $sq_subject     = $this->sequence_subject;
        $sender_info = EmailAccount::find($this->smtp_id);

        $reply_emails = $reply_subjects = $reply_bodies = $reply_created_at = $msgnos = $uids = $msg_ids = $refs = $in_replies_to = [];

        $email_subscribers = EmailListSubscriber::whereHas('contacted')->whereHas('opens')->where('list_id', $list_id)->get();

        try {
            $mbox = imap_open("{{$imap_host_name}:{$imap_port}/imap/ssl/novalidate-cert}INBOX", $imap_user_name, $imap_password);
        } catch (\Exception $e) {
            $sender_info->update(['is_connection_failed' => 1]);
            Log::info('connection failed', [$e->getMessage()]);
            return false;
        }

        imap_ping($mbox);
        if ($sender_info->last_search_time) {
            $searched_date = Carbon::parse($sender_info->last_search_time)->format('d F Y');
        } else {
            $searched_date = Carbon::parse($tenant->created_time)->format('d F Y');
        }

        foreach ($email_subscribers as $email)
        {
            $user_details       = json_decode($email->other);
            $mark_tag           = [];
            $marks_body         = [];

            foreach ($user_details as $key=>$tag)
            {
                $mark_tag[] = '{'.$key."}";
                $marks_body[] = $tag;
            }

            $replaced_subject   = str_replace($mark_tag, $marks_body, $subject);
            // $search_criteria    = 'SUBJECT "' . $replaced_subject . '" SINCE "' . $searched_date . '"';
            $search_criteria    = '';
//            $search_criteria    = 'BODY "' . $drip_uid . '"';
            $emails             = imap_search($mbox, $search_criteria);
            if ($emails) {
                foreach ($emails as $email_number) {
                    // Fetch the email header and body
                    $header = imap_fetch_overview($mbox, $email_number, 0);
                    $structure = imap_fetchstructure($mbox, $email_number);
                    $body = '';
                    if (isset($structure->parts[1]) && is_array($structure->parts)) {
                        $part = $structure->parts[1];
                        $body = imap_fetchbody($mbox, $email_number, 2);
                        if ($part->encoding == 1) {
                            $body = quoted_printable_decode(imap_8bit(($body)));
                        }if ($part->encoding == 2) {
                            $body = imap_binary(($body));
                        }if ($part->encoding == 3) {
                            $body = imap_base64($body);
                        }if ($part->encoding == 4) {
                            $body = quoted_printable_decode($body);
                        }else {
                            $body = imap_qprint($body);
                        }
                    }

                    // Extract the reply email, subject, and body
                    preg_match('~<([^{]*)>~i', $header[0]->from, $match);

                    if (array_key_exists(1,$match))
                    {
                        $reply_emails[]     = $match[1];
                        $reply_subjects[]   = utf8_decode(imap_utf8($header[0]->subject));
                        $reply_bodies[]     = $body;
                        $msgnos[]           = $header[0]->msgno;
                        $uids[]             = $header[0]->uid;
                        $reply_created_at[] = $header[0]->date;
                        $msg_ids[]          = $header[0]->message_id;
                        $refs[]             = $header[0]->references ?? null;//references
                        $in_replies_to[]    = $header[0]->in_reply_to ?? null;
                    }
                }

                foreach ($reply_emails as $key=> $reply_email)
                {
                    $this->addReplyEmail($cam_id, $reply_email, $reply_subjects[$key], $reply_bodies[$key],$sender_info->smtp_from_email,$msgnos[$key],$uids[$key]
                    ,$reply_created_at[$key],$msg_ids[$key],$refs[$key],$in_replies_to[$key]);
                }
            }
            $reply_emails = $reply_subjects = $reply_bodies = $reply_to_mails = $msgnos = $uids = [];
        }
        imap_close($mbox);
        $sender_info->update([
            'last_search_time' => now()
        ]);
    }

    public function addReplyEmail($cam_id, $email, $email_subject, $email_body, $to_mail, $msg_no, $uid, $created_at, $msg_id, $ref, $in_reply_to,$attachments)
    {
        $sb = DripReply::where([
            ['drip_id', $cam_id],
            ['email', $email],
            ['email_msgno', $msg_no],
            ['email_uid', $uid]
        ])->first();

        if (!$sb) {
            $thread = UniboxThread::where('sender_mail', $to_mail)->where('recipient_mail', $email)->where('status', 1)->first();

            if ($thread && $thread->is_deleted == 1) {
                $thread->update([
                    'is_deleted' => 0
                ]);
            }

            if (!$thread) {
                $thread = UniboxThread::create([
                    'drip_campaign_id' => $cam_id,
                    'sender_mail' => $to_mail,
                    'recipient_mail' => $email
                ]);
            }

            DB::table('drip_replies')->insert([
                'drip_id'           => $cam_id,
                'unibox_thread_id'  => $thread->id,
                'to_mail'           => '["' . $to_mail . '"]',
                'email'             => $email,
                'subject'           => $email_subject,
                'body'              => $email_body,
                'body'              => $email_body,
                'attachment'        => json_encode($attachments),
                'email_msgno'       => $msg_no,
                'email_uid'         => $uid,
                'message_id'        => $msg_id,
                'refs'              => $ref,
                'in_reply_to'       => $in_reply_to,
                'status'            => 0,
                'created_at'        => Carbon::parse($created_at),
                'updated_at'        => now()
            ]);
        }
    }
}
