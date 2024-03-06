<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReplyEmailResource;
use App\Http\Resources\UniboxResource;
use App\Mail\ReplySMTPEmail;
use App\Models\BlockList;
use App\Models\Emails\DripReply;
use App\Models\Emails\EmailAccount;
use App\Models\ReplyEmail;
use App\Models\UniboxThread;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class DripReplyController extends Controller
{
    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $data = UniboxThread::with('lastReply','emailAccount')->when($request->status,function ($query) use ($request){
                $query->where('lead_status',$request->status);
            })->when($request->q,function ($query) use ($request){
                $query->where('recipient_mail','LIKE',"%".$request->q."%");
            })->whereHas('lastReply')->withMax('replies','id')
                ->orderByDesc('replies_max_id')->where('is_deleted',0)->where('status',1)->paginate(15);

            return response()->json([
                'status'        => 'success',
                'message'       => 'Get drip replies',
                'replies'       => UniboxResource::collection($data),
                'page'          => $data->currentPage(),
                'has_more_data' => $data->hasMorePages(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 403,
                'error' => $e->getMessage()
            ],403);
        }
    }

    public function statusUpdate(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator      = Validator::make($request->all(), [
            'id'        => 'required',
            'status'    => 'required|in:lead,hot_lead,interested,not_interested,out_or_away,do_not_contact,sale,wrong_person'
        ]);

        if ($validator->fails())
        {
            return response()->json([
                'status'    => 'error',
                'error'     => $validator->errors()
            ], 422);
        }
        try {
            $thread              = UniboxThread::find($request->id);
            $thread->lead_status = $request->status;
            $thread->save();
            return response()->json([
                'status' => 'success',
                'message' => 'Lead Status Updated',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something Went Wrong',
            ],403);
        }
    }

    public function removeLead(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator                  = Validator::make($request->all(), [
            'id'                    => 'required',
            'remove_from_campaign'  => 'required_without:add_to_block_list',
            'add_to_block_list'     => 'required_without:remove_from_campaign'
        ]);

        if ($validator->fails())
        {
            return response()->json([
                'status'    => 'error',
                'error'     => $validator->errors()
            ], 422);
        }
        try {

            $thread = UniboxThread::find($request->id);

            if ($request->add_to_block_list)
            {
                $block_list = BlockList::where('email',$thread->recipient_mail)->first();
                if (!$block_list)
                {
                    BlockList::create([
                        'email' => $thread->recipient_mail
                    ]);
                }

            }

            if ($request->remove_from_campaign)
            {
                $thread->is_deleted = 1;
                $thread->save();
            }
            return response()->json([
                'message' => 'Lead has been removed successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something Went Wrong'
            ],403);
        }
    }

    public function destroy($tenant,$id): \Illuminate\Http\JsonResponse
    {
        try {
            UniboxThread::where('id',$id)->update([
                'is_deleted' => 1
            ]);

            return response()->json([
                'status'        => 'success',
                'message'       => 'Reply Deleted Successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something Went Wrong'
            ],403);
        }
    }

    public function readUnread(Request $request)
    {
        $validator  = Validator::make($request->all(), [
            'id'    => 'required',
            'value' => 'in:0,1',
            'email' => 'required'
        ]);

        if ($validator->fails())
        {
            return response()->json([
                'status'    => 'error',
                'error'     => $validator->errors()
            ], 422);
        }
        try {
            if ($request->value == 1) {
                $msg = 'Mark as read successfully';
            } else {
                $msg = 'Mark as unread successfully';
            }

            $thread             = UniboxThread::find($request->id);
            $smtp_id            = @$thread->emailAccount->id;
            DripReply::where('unibox_thread_id',$request->id)->update(['status'=>$request->value]);

            $threads = DripReply::where('unibox_thread_id',$request->id)->orderBy('id','desc')->get();

            $replies = [];

            foreach ($threads as $reply) {
                $to_mail_count = is_array($reply->to_mail) ? count($reply->to_mail) : 0;
                $body = $reply->body;
                $body = str_replace("<p>","<div>",$body);
                $body = str_replace("</p>","</div>",$body);

                $replies[]          = [
                    'id'            => $reply->id,
                    'email'         => $reply->email,
                    'to_email'      => $to_mail_count > 1 ? implode(",",$reply->to_mail) : ($to_mail_count > 0 ? $reply->to_mail[0] : $reply->to_mail),
                    'smtp_id'       => $smtp_id,
                    'Re'            => $reply->subject,
                    'emailBody'     => $body,
                    'attachments'   => json_decode($reply->attachment),
                    'status'        => $reply->status,
                    "lead_status"   => $reply->lead_status,
                    'date'          => Carbon::parse($reply->created_at)->format('M d, Y'),
                    'body_date'     => Carbon::parse($reply->created_at)->format('D, M d, Y h:i A'),
                    'created_at'    => $reply->created_at,
                ];
            }

            return response()->json([
                'status'        => 'success',
                'message'       => $msg,
                'emails'        => $replies,
                'id'            => $request->id,
                'sender_email'  => $thread->recipient_mail,
                'lead_status'   => $thread->lead_status
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something Went Wrong'
            ],403);
        }
    }

    public function sendMail(Request $request)
    {
        $validator      = Validator::make($request->all(), [
            'id'        => 'required',
            'smtp_id'   => 'required',
            'to_mail'   => 'required',
            'subject'   => 'required',
            'body'      => 'required',
        ]);

        if ($validator->fails())
        {
            return response()->json([
                'status'    => 'error',
                'error'     => $validator->errors()
            ], 422);
        }

        try {
            $thread         = UniboxThread::find($request->id);
            $sender_info    = EmailAccount::find($request->smtp_id);
            $sender_name    = $sender_info->smtp_from_name;
            $sender_email   = $sender_info->smtp_from_email;
            $stmp = [
                'mail.mailers' => ['user_stmp' => [
                    'transport' => 'smtp',
                    'host' => $sender_info->smtp_host_name,
                    'port' => $sender_info->smtp_port,
                    'encryption' => $sender_info->smtp_port == '465' ? 'ssl' : 'tls',
                    'username' => $sender_info->smtp_user_name,
                    'password' => $sender_info->smtp_password,
                    'from' =>
                        [
                            //FIXME TWO BOTTOM LINES MUST BE GIVEN A DO OVER PROBABLY
                            'address' => $sender_email,
                            'name' => $sender_name,
                        ],
                ]]
            ];
            config()->set($stmp);
            Mail::mailer('user_stmp')->send('emails.reply', [
                'from' => $sender_email,
                'body' => $request->body,
            ], function ($m) use ($sender_email, $sender_name, $request) {
                $m->from($sender_email, $sender_name);
                $m->to($request->to_mail)->subject($request->subject);
                if ($request->cc)
                {
                    $m->cc($request->cc);
                }
                if ($request->bcc)
                {
                    $m->bcc($request->bcc);
                }
            });


            DripReply::create([
                'drip_id'           => $thread->drip_campaign_id,
                'unibox_thread_id'  => $thread->id,
                'to_mail'           => $request->to_mail,
                'cc'                => $request->cc,
                'bcc'               => $request->bcc,
                'email'             => $sender_email,
                'subject'           => $request->subject,
                'body'              => $request->body,
                'follow_up_days'    => $request->follow_up_days ?: 0,
                'status'            => 1,
            ]);

            $threads        = DripReply::where('unibox_thread_id',$thread->id)->orderBy('id','desc')->get();
            $replies        = [];

            foreach ($threads as $reply) {
                $to_mail_count = is_array($reply->to_mail) ? count($reply->to_mail) : 0;
                $replies[]          = [
                    'id'            => $reply->id,
                    'email'         => $reply->email,
                    'smtp_id'       => @$reply->emailAccount->id,
                    'to_email'      => $to_mail_count > 1 ? implode(",",$reply->to_mail) : ($to_mail_count > 0 ? $reply->to_mail[0] : $reply->to_mail),
                    'Re'            => $reply->subject,
                    'emailBody'     => $reply->body,
                    'status'        => $reply->status,
                    "lead_status"   => $reply->lead_status,
                    'date'          => Carbon::parse($reply->created_at)->format('M d, Y'),
                    'body_date'     => Carbon::parse($reply->created_at)->format('D, M d, Y h:i A')
                ];
            }

            return response()->json([
                'success'   => 'Email Sent Successfully',
                'message'   => 'Email Sent Successfully',
                'emails'    => $replies,
                'id'        => $thread->id
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ],403);
        }
    }

    public function getEmailCount(): \Illuminate\Http\JsonResponse
    {
        try {
            $replies = UniboxThread::whereHas('replies',function ($query){
                $query->where('status',0)->where('is_deleted',0);
            })->where('is_deleted',0)->count();

            return response()->json([
                'unread_replies'    => $replies,
                'success'           => 'Unread Emails Fetched Successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something Went Wrong'
            ],403);
        }
    }
}
