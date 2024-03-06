<?php

namespace App\Http\Controllers;

use App\Jobs\EmailDownload;
use App\Models\Instruction;
use App\Models\Tenant;
use App\Models\tenant_db_name;
use Carbon\CarbonTimeZone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;


use App\Models\Emails\DripCampaign;
use App\Models\Emails\DripReply;
use App\Models\Emails\EmailAccount;
use App\Models\Emails\EmailListSubscriber;
use App\Models\ReplyEmail;
use App\Models\UniboxThread;
use Carbon\Carbon;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use PragmaRX\Google2FA\Support\Base32;
use Illuminate\Support\Facades\Storage;
use Webklex\IMAP\Facades\Client;
use Webklex\PHPIMAP\Folder\Folder;
use Webklex\PHPIMAP\Message;
use Webklex\PHPIMAP\Attachment;
use Webklex\PHPIMAP\Support\MessageCollection;
use Webklex\PHPIMAP\Header\Header;


class FrontendController extends Controller
{

    public function __construct(Request $request)
    {
//        $host = $request->getHost();
//        $host_id = explode('.', trim($host))[0];
//        $tenant = Tenant::where('id', $host_id)->first();
//        $db_count = tenant_db_name::where('tenant_id', $host_id)->first();
//
//
//        DB::purge('tenant');
//        DB::disconnect('tenant');
//        Config::set('database.connections.mysql.database', $tenant->tenancy_db_name);
//        Config::set('database.connections.tenant.host', '127.0.0.1');
//        Config::set('database.connections.tenant.username', 'root');
//        Config::set('database.connections.tenant.password', '');
//        Config::set('tenancy.database.template_tenant_connection', $db_count->db_con_use);
//        Config::set('database.default', $tenant->tenancy_db_name);
//        DB::reconnect('tenant');
//

//        Config::set('database.default', 'tenant');
//        // maybe disconnect your tenant database connection.
//        DB::purge('tenant');
//        DB::disconnect('tenant');
//        Schema::connection('tenant')->getConnection()->disconnect();
//        Config::set('queue.connections.database.connection', $db_count->db_con_use);
//        dd(Config::set('database.default'));
//        dd(Config::get('database.default'));
    }


    public function index(Request $request)
    {

//        $host = $request->getHost();
//        $host_id = explode('.', trim($host))[0];
//        $tenant = Tenant::where('id', $host_id)->first();
//        $db_count = tenant_db_name::where('tenant_id', $host_id)->first();
        return view('auth.login');
    }

    public function instruction()
    {
        $instruction = Instruction::first();
        return response()->json([
            'instruction' => $instruction,
            'status'   => 'success',
        ],200);
    }


    //test data

    public function handle()
    {
        $tenet_id = 'chingpong1698841360';
        $db_count = tenant_db_name::where('tenant_id', $tenet_id)->first();
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

    public function findReply($tenant){

        $imap_host_name = 'ecoshoppee.com';
        $imap_user_name = "info@ecoshoppee.com";
        $imap_password = "wgW,bGRDBPc}";
        $imap_port = 993;
        $cam_id = 43;
        $subject = 'step 1';
        $list_id = 53;

//        $sq_subject     = $this->sequence_subject;
        $sender_info = EmailAccount::find(4);


        $email_subscribers = EmailListSubscriber::whereHas('contacted')->whereHas('opens')->where('list_id', $list_id)->get();

        $client = Client::make([
            'host'     => 'ecoshoppee.com',
            'port'     => 993,
            'encryption' => 'ssl',
            // 'validate_cert' => false,
            'username' => 'info@ecoshoppee.com',
            'password' => 'wgW,bGRDBPc}',

            // 'host'     => 'mail.privateemail.com',
            // 'port'     => 993,
            // 'encryption' => 'ssl',
            // // 'validate_cert' => false,
            // 'username' => 'chad@gosignaturelocker.com',
            // 'password' => '05UbxkQC@1$f^zm4e8',

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
