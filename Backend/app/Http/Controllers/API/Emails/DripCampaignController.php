<?php

namespace App\Http\Controllers\API\Emails;

use App\Http\Controllers\Controller;
use App\Http\Resources\CampaignResource;
use App\Http\Resources\DripCampaignResource;
use App\Jobs\DripRespondJob;
use App\Mail\SendSmtpMail;
use App\Models\DripEmail;
use App\Models\Emails\DripCampaign;
use App\Models\Emails\DripClick;
use App\Models\Emails\DripOpen;
use App\Models\Emails\DripReply;
use App\Models\Emails\DripRespond;
use App\Models\Emails\DripSequence;
use App\Models\Emails\DripUrl;
use App\Models\Emails\EmailAccount;
use App\Models\Emails\EmailList;
use App\Models\Emails\EmailListSubscriber;
use App\Models\Emails\TimeFilter;
use App\Models\EmailSequence;
use App\Models\Tenant;
use App\Models\tenant_db_name;
use App\Models\UniboxThread;
use App\Models\user_plan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\Facades\Image;
use App\Repositories\CampaignRepository;


class DripCampaignController extends Controller
{
    private $campaign_data = [
        'campaign_name' => 'required',
//        'from_name' => 'required',
//        'from_email' => 'required',
        'subject' => 'required',
        'smtp_id' => 'required',
        'email_body' => 'required',
        'delay_email' => 'nullable',
        'max_email' => 'nullable',
        'tracking' => 'nullable',
        'stop_on_reply' => 'nullable',
    ];
    private $title = 'Drip Campaign';
    public $status = ['pause', 'pending', 'sending', 'sent'];

    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $paginate = $request->page_size ? : 10;

            $data = DripCampaign::withCount('emails')->withCount('emailSubscribers')->withCount('cmpClick as total_click')->withCount('opens as total_open')
                ->when($request->q,function ($query) use ($request){
                    $query->where('campaign_name','LIKE',"%".$request->q."%");
                })->latest()->where('user_id', auth()->id())->paginate($paginate);

            return response()->json([
                'status'        => 'success',
                'message'       => $this->title . ' loaded successfully.',
                'data'          => DripCampaignResource::collection($data),
                'total_rows'    => $data->total(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ],403);
        }
    }
    public function getEmailCampaig($t_id, $id): \Illuminate\Http\JsonResponse
    {
        try {
            $open_date = $reply_date = $unsubscribe_date = $contact_date = $click_date = '';
            $data                               = DripCampaign::with('cmpClick', 'timeFilter','sequences','subscribers')->find($id);
            
            $email_subscribers_list = array();
            foreach ($data->subscribers as $key => $value) {
                
                $contacted = $value->contacted->count('count');
                $clicks = $value->clicks->count('count');
                $opens = $value->opens->count('count');
                $replies = $value->replies->count('count');
                // $replies = 0;
                $email_subscribers_list[] = array(

                    'id' => $value->id,
                    'list_id' => $value->list_id,
                    'email' => $value->email,
                    'contacted' => $contacted,
                    'clicks' => $clicks,
                    'opens' => $opens,
                    'replies' => $replies,
                );

            }


            $list_id                            = $data->list_id;
            $opens                              = $data->opens;
            $replies                            = $data->replies;
            $clicks                             = $data->cmpClick;
            $unsubscribes                       = $data->unSubscribes;
            $contacts                           = $data->emails;
            $open_counter                       = count($opens);
            $reply_counter                      = DripReply::where('drip_id',$id)->where('is_deleted',0)->distinct('unibox_thread_id')->count();
            $click_counter                      = count($clicks);
            $unsubscribes_counter               = count($unsubscribes);
            $contacts_counter                   = count($contacts);
            $total_subscribers                  = count($data->emailSubscribers) * count($data->sequences);
            $unique_opens                       = DripOpen::where('drip_id',$data->id)->distinct('subscriber_id')->count();
            $unique_contacts                    = DripEmail::where('list_id',$data->id)->distinct('subscriber_id')->count();
            $opened_percentage                  = $total_subscribers == 0 || $unique_opens == 0 ? 0 : round(($unique_opens / $unique_contacts)*100,2);
            $replied_percentage                 = $total_subscribers == 0 || $reply_counter == 0 ? 0 : round(($reply_counter / $contacts_counter)*100,2);
            $unsubscribed_percentage            = $total_subscribers == 0 || $unsubscribes_counter == 0 ? 0 : round(($unsubscribes_counter / $contacts_counter)*100,2);
            $contacted_percentage               = $total_subscribers == 0 || $contacts_counter == 0 ? 0 : round(($contacts_counter / $total_subscribers)*100,2);
            $clicked_percentage                 = $total_subscribers == 0 || $click_counter == 0 ? 0 : round(($click_counter / $contacts_counter)*100,2);
            $opened_recipients                  = $open_counter;
            $reply_recipients                   = $reply_counter;
            $unsubscribe_recipients             = $unsubscribes_counter;
            $contacts_recipients                = $contacts_counter;
            $click_recipients                   = $click_counter;

            if ($open_counter > 0)
            {
                $open_date = Carbon::parse($opens->last()->created_at);
            }

            if ($reply_counter > 0)
            {
                $reply_date = Carbon::parse($replies->last()->created_at);
            }

            if ($unsubscribes_counter > 0)
            {
                $unsubscribe_date = Carbon::parse($unsubscribes->last()->created_at);
            }

            if ($contacts_counter > 0)
            {
                $contact_date = Carbon::parse($contacts->last()->created_at);
            }

            if ($click_counter > 0)
            {
                $click_date = Carbon::parse($clicks->last()->created_at);
            }

            if ($open_date > $reply_date && $open_date > $unsubscribe_date && $open_date > $contact_date && $open_date > $click_date)
            {
                $end_date = $open_date;
            }
            elseif ($reply_date > $open_date && $reply_date > $unsubscribe_date && $reply_date > $contact_date && $reply_date > $click_date)
            {
                $end_date = $reply_date;
            }
            elseif ($unsubscribe_date > $open_date && $unsubscribe_date > $reply_date && $unsubscribe_date > $contact_date && $unsubscribe_date > $click_date)
            {
                $end_date = $unsubscribe_date;
            }
            elseif ($contact_date > $open_date && $contact_date > $reply_date && $contact_date > $unsubscribe_date && $contact_date > $click_date)
            {
                $end_date = $contact_date;
            }
            elseif ($click_date > $open_date && $click_date > $reply_date && $click_date > $unsubscribe_date && $click_date > $contact_date)
            {
                $end_date = $click_date;
            }
            else{
                $end_date = Carbon::now();
            }

            $all_opens = $all_replies= $all_clicks = $all_unsubscribes = $all_contacts = $categories = [];
            $campaign_date  = Carbon::parse($data->created_at);
            $diff_in_days   = $campaign_date->diffInDays($end_date) + 1;

            if ($diff_in_days <= 31)
            {
                $date_range = $campaign_date->daysUntil($end_date->addDays(1));

                $dates =  [];
                foreach ($date_range as $date) {
                    $categories[] = $date->format('d M');
                    $dates[] = $date->format('Y-m-d');
                }

                $opens = DripOpen::where('drip_id',$data->id)->whereBetween('created_at',[$campaign_date->format('Y-m-d').' 00:00:00',$end_date->format('Y-m-d').' 23:59:59'])
                    ->selectRaw('DATE_FORMAT(created_at, "%Y-%m-%d") as date,COUNT(*) as total_count')->groupBy('date')->pluck('total_count','date')->toArray();
                $replies = DripReply::where('drip_id',$data->id)->whereBetween('created_at',[$campaign_date->format('Y-m-d').' 00:00:00',$end_date->format('Y-m-d').' 23:59:59'])
                    ->selectRaw('DATE_FORMAT(created_at, "%Y-%m-%d") as date,COUNT(DISTINCT email) as total_count')->groupBy('date')->pluck('total_count','date')->toArray();
                $clicks = DripClick::where('drip_id',$data->id)->whereBetween('created_at',[$campaign_date->format('Y-m-d').' 00:00:00',$end_date->format('Y-m-d').' 23:59:59'])
                    ->selectRaw('DATE_FORMAT(created_at, "%Y-%m-%d") as date,COUNT(count) as total_count')->groupBy('date')->pluck('total_count','date')->toArray();
                $unsubscribes = EmailListSubscriber::where('list_id',$data->list_id)->where('status',0)
                    ->whereBetween('updated_at',[$campaign_date->format('Y-m-d').' 00:00:00',$end_date->format('Y-m-d').' 23:59:59'])
                    ->selectRaw('DATE_FORMAT(updated_at, "%Y-%m-%d") as date,COUNT(*) as total_count')->groupBy('date')->pluck('total_count','date')->toArray();
                $contacts = DripEmail::where('list_id',$data->list_id)->where('status',1)
                    ->whereBetween('created_at',[$campaign_date->format('Y-m-d').' 00:00:00',$end_date->format('Y-m-d').' 23:59:59'])
                    ->selectRaw('DATE_FORMAT(created_at, "%Y-%m-%d") as date,COUNT(*) as total_count')->groupBy('date')->pluck('total_count','date')->toArray();

                foreach ($dates as $new_date)
                {
                    $all_opens[$new_date]           = in_array($new_date,array_keys($opens)) ? (int)$opens[$new_date] : 0;
                    $all_replies[$new_date]         = in_array($new_date,array_keys($replies)) ? (int)$replies[$new_date] : 0;
                    $all_clicks[$new_date]          = in_array($new_date,array_keys($clicks)) ? (int)$clicks[$new_date] : 0;
                    $all_unsubscribes[$new_date]    = in_array($new_date,array_keys($unsubscribes)) ? (int)$unsubscribes[$new_date] : 0;
                    $all_contacts[$new_date]        = in_array($new_date,array_keys($contacts)) ? (int)$contacts[$new_date] : 0;
                }
            }
            elseif ($diff_in_days <= 366)
            {
                $current_date = $campaign_date->copy()->startOfMonth();

                while($current_date->lessThanOrEqualTo($end_date))
                {
                    $categories[] = $current_date->format('M Y');
                    $current_date->addMonth();
                }

                $opens = DripOpen::where('drip_id',$data->id)->whereBetween('created_at',[$campaign_date->format('Y-m-d').' 00:00:00',$end_date->format('Y-m-d').' 23:59:59'])
                    ->selectRaw('DATE_FORMAT(created_at, "%b %Y") as date,MONTH(created_at) as month,COUNT(count) as total_count')->groupBy('month')->pluck('total_count','date')->toArray();
                $replies = DripReply::where('drip_id',$data->id)->whereBetween('created_at',[$campaign_date->format('Y-m-d').' 00:00:00',$end_date->format('Y-m-d').' 23:59:59'])
                    ->selectRaw('DATE_FORMAT(created_at, "%b %Y") as date,MONTH(created_at) as month,COUNT(DISTINCT email) as total_count')->groupBy('month')->pluck('total_count','date')->toArray();
                $clicks = DripClick::where('drip_id',$data->id)->whereBetween('created_at',[$campaign_date->format('Y-m-d').' 00:00:00',$end_date->format('Y-m-d').' 23:59:59'])
                    ->selectRaw('DATE_FORMAT(created_at, "%b %Y") as date,MONTH(created_at) as month,COUNT(count) as total_count')->groupBy('month')->pluck('total_count','date')->toArray();
                $unsubscribes = EmailListSubscriber::where('list_id',$data->list_id)->where('status',0)
                    ->whereBetween('updated_at',[$campaign_date->format('Y-m-d').' 00:00:00',$end_date->format('Y-m-d').' 23:59:59'])
                    ->selectRaw('DATE_FORMAT(updated_at, "%b %Y") as date,MONTH(updated_at) as month,COUNT(*) as total_count')->groupBy('month')->pluck('total_count','date')->toArray();
                $contacts = DripEmail::where('list_id',$data->list_id)->where('status',1)
                    ->whereBetween('created_at',[$campaign_date->format('Y-m-d').' 00:00:00',$end_date->format('Y-m-d').' 23:59:59'])
                    ->selectRaw('DATE_FORMAT(created_at, "%b %Y") as date,MONTH(created_at) as month,COUNT(*) as total_count')->groupBy('month')->pluck('total_count','date')->toArray();

                foreach ($categories as $new_date)
                {
                    $all_opens[$new_date]           = in_array($new_date,array_keys($opens)) ? (int)$opens[$new_date] : 0;
                    $all_replies[$new_date]         = in_array($new_date,array_keys($replies)) ? (int)$replies[$new_date] : 0;
                    $all_clicks[$new_date]          = in_array($new_date,array_keys($clicks)) ? (int)$clicks[$new_date] : 0;
                    $all_unsubscribes[$new_date]    = in_array($new_date,array_keys($unsubscribes)) ? (int)$unsubscribes[$new_date] : 0;
                    $all_contacts[$new_date]        = in_array($new_date,array_keys($contacts)) ? (int)$contacts[$new_date] : 0;
                }
            }
            else{
                $start_year = $campaign_date->year;

                $end_year = $end_date->year;

                for ($year = $start_year; $year <= $end_year; $year++) {
                    $formatted_year = \Carbon\Carbon::create($year, 1, 1)->format('Y');
                    $categories[] = $formatted_year;
                }

                $opens = DripOpen::where('drip_id',$data->id)->whereBetween('created_at',[$campaign_date->format('Y-m-d').' 00:00:00',$end_date->format('Y-m-d').' 23:59:59'])
                    ->selectRaw('DATE_FORMAT(created_at, "%Y") as date,YEAR(created_at) as year,COUNT(count) as total_count')->groupBy('year')->pluck('total_count','date')->toArray();
                $replies = DripReply::where('drip_id',$data->id)->whereBetween('created_at',[$campaign_date->format('Y-m-d').' 00:00:00',$end_date->format('Y-m-d').' 23:59:59'])
                    ->selectRaw('DATE_FORMAT(created_at, "%Y") as date,YEAR(created_at) as year,COUNT(DISTINCT email) as total_count')->groupBy('year')->pluck('total_count','date')->toArray();
                $clicks = DripClick::where('drip_id',$data->id)->whereBetween('created_at',[$campaign_date->format('Y-m-d').' 00:00:00',$end_date->format('Y-m-d').' 23:59:59'])
                    ->selectRaw('DATE_FORMAT(created_at, "%Y") as date,YEAR(created_at) as year,COUNT(count) as total_count')->groupBy('year')->pluck('total_count','date')->toArray();
                $unsubscribes = EmailListSubscriber::where('list_id',$data->list_id)->where('status',0)
                    ->whereBetween('updated_at',[$campaign_date->format('Y-m-d').' 00:00:00',$end_date->format('Y-m-d').' 23:59:59'])
                    ->selectRaw('DATE_FORMAT(updated_at, "%Y") as date,YEAR(updated_at) as year,COUNT(*) as total_count')->groupBy('year')->pluck('total_count','date')->toArray();
                $contacts = DripEmail::where('list_id',$data->list_id)->where('status',1)
                    ->whereBetween('created_at',[$campaign_date->format('Y-m-d').' 00:00:00',$end_date->format('Y-m-d').' 23:59:59'])
                    ->selectRaw('DATE_FORMAT(created_at, "%Y") as date,YEAR(created_at) as year,COUNT(*) as total_count')->groupBy('year')->pluck('total_count','date')->toArray();

                foreach ($categories as $new_date)
                {
                    $all_opens[$new_date]           = in_array($new_date,array_keys($opens)) ? (int)$opens[$new_date] : 0;
                    $all_replies[$new_date]         = in_array($new_date,array_keys($replies)) ? (int)$replies[$new_date] : 0;
                    $all_clicks[$new_date]          = in_array($new_date,array_keys($clicks)) ? (int)$clicks[$new_date] : 0;
                    $all_unsubscribes[$new_date]    = in_array($new_date,array_keys($unsubscribes)) ? (int)$unsubscribes[$new_date] : 0;
                    $all_contacts[$new_date]        = in_array($new_date,array_keys($contacts)) ? (int)$contacts[$new_date] : 0;
                }
            }

            $response                       = [
                'analytics'                 => [
                    'categories'            => $categories,
                    'opens'                 => array_values($all_opens),
                    'replies'               => array_values($all_replies),
                    'clicks'                => array_values($all_clicks),
                    'unsubscribes'          => array_values($all_unsubscribes),
                    'contacts'              => array_values($all_contacts)
                ],
//                'email_subscribers'         => SubscriberWithCountersResource::collection(EmailListSubscriber::withSum('clicks as total_click','count')->withSum('opens as total_open','count')->withCount('contacted')->latest()->where('list_id', $list_id)->get()),
                'sequences'                 => $data->sequences,
                'csvrow'                    => json_decode($data->subscribers[0]->other ?? null, true),
                'time_filter'               => [
                    'id'                    => $data->timeFilter->id,
                    'created_at'            => $data->timeFilter->created_at,
                    'days'                  => $data->timeFilter->days,
                    'drip_id'               => $data->timeFilter->drip_id,
                    'start_at'              => $data->timeFilter->start_at,
                    'start_date'            => Carbon::parse($data->timeFilter->start_date)->format('Y-m-d'),
                    'stop_at'               => $data->timeFilter->stop_at,
                    'time_zone'             => $data->timeFilter->time_zone,
                    'updated_at'            => $data->timeFilter->updated_at,
                ],
                'email_subscribers'         => $email_subscribers_list,
                'campaign_date'             => $data->campaign_date,
                'campaign_name'             => $data->campaign_name,
                'click_recipients'          => $click_recipients,
                'clicked_percentage'        => $clicked_percentage,
                'contacted_percentage'      => $contacted_percentage,
                'contacts_recipients'       => $unique_contacts,
                'delay_email'               => $data->delay_email,
                'email_body'                => $data->email_body,
                'finished_at'               => $data->finished_at,
                'from_email'                => $data->from_email,
                'from_name'                 => $data->from_name,
                'id'                        => $data->id,
                'list_id'                   => $list_id,
                'max_email'                 => $data->max_email,
                'max_email_offset'          => $data->max_email_offset,
                'offset'                    => $data->offset,
                'opened_percentage'         => $opened_percentage,
                'opened_recipients'         => $unique_opens,
                'replied_percentage'        => $replied_percentage,
                'reply_recipients'          => $reply_recipients,
                'sent_at'                   => $data->sent_at,
                'smtp_id'                   => is_array($data->smtp_id) ? $data->smtp_id : [$data->smtp_id],
                'started_at'                => $data->started_at,
                'status'                    => $data->status,
                'stop_on_reply'             => $data->stop_on_reply,
                'subject'                   => $data->subject,
                'total'                     => $data->total,
                'tracking'                  => $data->tracking,
                'unsubscribe_recipients'    => $unsubscribe_recipients,
                'unsubscribed_percentage'   => $unsubscribed_percentage,
                'has_contact'               => $total_subscribers > 0,
            ];


            return response()->json([
                'status'                    => 'success',
                'message'                   => $this->title . ' loaded successfully.',
                'data'                      => $response
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 403);
        }
    }
    public function store($t_id,Request $request)
    {
        $validator = Validator::make($request->all(), $this->campaign_data);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'error' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            $sequence_body  = $request->sequences ? $request->sequences[0]['sq_body'] : '';
            $sequence_sub   = $request->sequences ? $request->sequences[0]['sq_subject'] : '';

            $list           = EmailList::create([
                'list_name' => $request->campaign_name,
                'list_uid'  => Str::uuid(),
                'user_id'   => auth()->id()
            ]);

            $email_accounts     = EmailAccount::whereIn('id',$request->smtp_id)->get();


            $drip               = DripCampaign::create([
                'user_id'       => auth()->id(),
                'dirp_uid'      => Str::uuid(),
                'status'        => (bool)$request->status,
                'campaign_name' => $request->campaign_name,
                'from_name'     => $email_accounts->pluck('smtp_from_name')->toArray(),
                'from_email'    => $email_accounts->pluck('smtp_from_email')->toArray(),
                'subject'       => $sequence_sub,
                'list_id'       => $list->id,
                'smtp_id'       => $request->smtp_id,
                'email_body'    => $sequence_body,
                'delay_email'   => $request->delay_email,
                'max_email'     => $request->max_email,
                'tracking'      => $request->tracking,
                'stop_on_reply' => $request->stop_on_reply,
            ]);

            TimeFilter::create([
                'drip_id'       => $drip->id,
                'days'          => implode(',', $request->days),
                'start_at'      => $request->start_at,
                'stop_at'       => $request->stop_at,
                'time_zone'     => $request->time_zone,
                'start_date'    => Carbon::parse($request->start_date)
            ]);

            $this->createSubscriber($request->all(),$list->id);
            $this->parseSequences($request->all(),$drip);
            $this->addCampaignUrl($drip->id);

            if ($drip->id == 1)
            {
                /*$tenant = tenant_db_name::where('tenant_id',$t_id)->first();
                $curl = curl_init();

                $payload = array(
                    "event_name"        => "First campaign has been created by $tenant->tenant_email",
                    "created_at"        => now()->timestamp,
                    "user_id"           => (string)$t_id,
                    "id"                => Str::random(32),
                    "email"             => $tenant->tenant_email,
                    "metadata"          => array(
                        "invite_code"   => $t_id
                    )
                );

                $token      = config('services.intercom.token');
                $version    = config('services.intercom.version');
                curl_setopt_array($curl, [
                    CURLOPT_HTTPHEADER => [
                        "Authorization: Bearer $token",
                        "Content-Type: application/json",
                        "Intercom-Version: $version"
                    ],
                    CURLOPT_POSTFIELDS => json_encode($payload),
                    CURLOPT_URL => "https://api.intercom.io/events",
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_CUSTOMREQUEST => "POST",
                ]);

                $response = curl_exec($curl);
                $error = curl_error($curl);

                curl_close($curl);*/
            }

            DB::commit();
            return response()->json([
                'status'    => 'success',
                'message'   => $this->title . ' created successfully.',
                'data'      => $drip->id
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => $e->getMessage()
            ], 403);
        }
    }

    protected function createSubscriber($data,$list_id)
    {
        $emails = $existing_emails = [];

        $subscribers = is_string($data['email_subscribers']) ? json_decode($data['email_subscribers'],true) : $data['email_subscribers'];

        if (array_key_exists('duplicate_status',$data) && $data['duplicate_status'] == 1)
        {
            $existing_emails =  EmailListSubscriber::whereHas('campaign')->where(function ($query) use($subscribers){
                $query->whereIn('email',array_column($subscribers, 'Email'))
                    ->orwhereIn('email',array_column($subscribers, 'email'));
            })->pluck('email')->toArray();
        }

        $duplicates = $i = 0;
        $key = '';

        foreach ($subscribers as $datum)
        {
            if ($i == 0)
            {
                $key = array_key_exists('email',$datum) ? 'email' : 'Email';
            }
            if (array_key_exists('duplicate_status',$data) && $data['duplicate_status'] == 1 && in_array($datum[$key],$existing_emails))
            {
                $duplicates++;
            }
            else{
                $emails[]               = [
                    'subscriber_uid'    => Str::uuid(),
                    'list_id'           => $list_id,
                    'email'             => $datum[$key],
                    'other'             => json_encode($datum),
                    'created_at'        => now(),
                    'updated_at'        => now(),
                ];
            }
            $i++;
        }

        $chunks = array_chunk($emails,1000);

        foreach ($chunks as $chunk)
        {
            EmailListSubscriber::insert($chunk);
        }

        if (array_key_exists('duplicate_status',$data) && $data['duplicate_status'] == 1 && $duplicates > 0)
        {
            $msg ="Found ". $duplicates. " duplicate, ". count($chunks). " were imported";
        }
        else{
            $msg = 'Leads imported successfully';
        }

        return $msg;
    }
    protected function parseSequences($data,$campaign)
    {
        $rows = [];

        if (array_key_exists('sequences',$data) && count($data['sequences']) > 0)
        {
            $startTime = Date('Y-m-d', strtotime($data['start_date']));
            foreach ($data['sequences'] as $key=> $sequence)
            {
                $rows = [
                    'sq_uid'        => Str::uuid(),
                    'drip_id'       => $campaign->id,
                    'wait_time'     => $sequence['wait_time'],
                    'sq_subject'    => $sequence['sq_subject'] ,
                    'sq_body'       => $sequence['sq_body'],
                    'start_date'    => $startTime,
                    'end_date'      => Date('Y-m-d', strtotime($startTime."+{$sequence['wait_time']} days")),
                    'status'        => 1,
                    'position'      => ++$key,
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ];

                DripSequence::insert($rows);
                $addDays = $sequence['wait_time'];
                $startTime = Date('Y-m-d', strtotime($startTime."+{$addDays} days"));

            }
        }
    }
    protected function emailSequence($data,$campaign)
    {
        $email_subscribers  = EmailListSubscriber::where('list_id',$campaign->list_id)->get();
        $sequences          = DripSequence::where('drip_id',$campaign->id)->get();
        $rows               = [];
        $i                  = 0;
        $last_time          = Carbon::parse($campaign->created_at);
        $total_added_days   = 0;

        foreach ($sequences as $sequence)
        {
            foreach ($email_subscribers as $key => $email_subscriber)
            {
                $start_time = $i > 0 ? $last_time->addMinutes($campaign->delay_email)->format('Y-m-d H:i:s') : $last_time->format('Y-m-d H:i:s');
                $last_time  = Carbon::parse($start_time);

                $rows[] = [
                    'subscriber_id' => $email_subscriber->id,
                    'campaign_id'   => $campaign->id,
                    'subject'       => $sequence->sq_subject,
                    'body'          => $sequence->sq_body,
                    'start_time'    => $start_time,
                    'end_time'      => Carbon::parse($start_time)->addMinutes($campaign->delay_email)->format('Y-m-d H:i:s'),
                    'status'        => 0,
                    'created_at'    => now()->format('Y-m-d H:i:s'),
                    'updated_at'    => now()->format('Y-m-d H:i:s'),
                ];
                $i++;
                if ($i == $campaign->max_email)
                {
                    /*$total_added_days++;
                    $days = $total_added_days;*/
                    $last_time = $last_time->addDays(1)->startOfDay();
                    $i = 0;
                }
            }
        }

        if (count($rows) > 0)
        {
            $chunk_rows = array_chunk($rows,1000);

            foreach ($chunk_rows as $chunk_row) {
                EmailSequence::insert($chunk_row);
            }
        }
        return true;
    }
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), $this->campaign_data);

        if ($validator->fails())
        {
            return response()->json([
                'status' => 'error',
                'error' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            $dripCampaign = DripCampaign::find($request->drip_id);
            if (!$dripCampaign) {
                return response()->json(['status' => 'error', 'message' => 'Campaign Not found'], 403);
            }
            $sequence_body          = $request->sequences ? $request->sequences[0]['sq_body'] : '';
            $sequence_sub           = $request->sequences ? $request->sequences[0]['sq_subject'] : '';
            $list                   = $dripCampaign->list;
            $subscribers            = is_string($request->email_subscribers) ? json_decode($request->email_subscribers,true) : ($request->email_subscribers ? : []);
            $requested_subscribers  = is_array($subscribers) && count($subscribers) > 0;

            if (!$list && $subscribers && $requested_subscribers)
            {
                $list           = EmailList::create([
                    'list_name' => $dripCampaign->campaign_name,
                    'list_uid'  => Str::uuid(),
                    'user_id'   => auth()->id()
                ]);
            }

            $email_accounts = EmailAccount::whereIn('id',$request->smtp_id)->get();
            if (count($subscribers) > 0)
            {
                $this->updateSubscriber($request->all(),@$list->id);
            }

            $time = $dripCampaign->started_at ? : ($requested_subscribers ? now()->format('Y-m-d H:i:s') : null);

            $dripCampaign->update([
                'status'        => $request->status,
                'campaign_name' => $request->campaign_name,
                'from_name'     => $email_accounts->pluck('smtp_from_name')->toArray(),
                'from_email'    => $email_accounts->pluck('smtp_from_email')->toArray(),
                'subject'       => $sequence_sub,
                'list_id'       => @$list->id,
                'smtp_id'       => $request->smtp_id,
                'email_body'    => $sequence_body,
                'delay_email'   => $request->delay_email,
                'max_email'     => $request->max_email,
                'tracking'      => $request->tracking,
                'stop_on_reply' => $request->stop_on_reply,
                'started_at'    => $time,
            ]);
            $timeFilter = TimeFilter::where('drip_id', $request->drip_id)->first();
            if ($timeFilter) {
                $timeFilter->update([
                    'days'          => implode(',', $request->days),
                    'start_at'      => $request->start_at,
                    'stop_at'       => $request->stop_at,
                    'time_zone'     => $request->time_zone,
                    'start_date'    => $request->start_date
                ]);
            }

            $exiting_sequence_id = $dripCampaign->sequences()->get()->pluck('id')->toArray();

            $upcomming_sequence_id =[];
            $previous_wait_time = 0;
            // foreach ($request->sequences as $key=> $sequence)
            // {
            //     if(arrayCheck('id',$sequence))
            //     {
            //         $this->updateSequece($sequence,$time,$request->status,$previous_wait_time,++$key);
            //         $upcomming_sequence_id[] = $sequence['id'];
            //     }
            //     else
            //     {
            //         $date           = $last_sequence->end_date;
            //         if (!$date)
            //         {
            //             $date = $time;
            //         }
            //         $this->addNewSequence($sequence,$dripCampaign,$date,++$key);
            //     }
            //     $previous_wait_time += $sequence['wait_time'];
            // }



            // return response()->json([
            //         'status'    => 'success',
            //         // 'existing'    => $exiting_sequence_id,
            //         // 'upcoming'    => $upcomming_sequence_id,
            //         // 'deleted_seq' => $deleted_sequence,
            //         'data'      => $last_sequence,
                    
            //     ], 200);
            $testarr = array();
            foreach ($request->sequences as $key=> $sequence)
            {

                $last_sequence  = $dripCampaign->sequences()->orderBy ('id', 'DESC')->first();


                if(arrayCheck('id',$sequence) && $sequence['id'] != null)
                {
                    // echo "not null";
                    $this->updateSequece($sequence,$time,$request->status,$previous_wait_time,++$key);
                    $upcomming_sequence_id[] = $sequence['id'];
                }
                else
                {
                    // echo "null";
                    if($last_sequence->end_date == date('Y-m-d')){
                        
                        $date = Date('Y-m-d', strtotime($last_sequence->end_date."+1 days"));
                    }
                    elseif(date('Y-m-d') > $last_sequence->end_date){
                      
                        $date = Date('Y-m-d', strtotime(Date('Y-m-d')."+1 days"));

                    }
                    elseif($last_sequence->end_date > $last_sequence->start_date){
                      
                        // $date = $last_sequence->end_date;
                        $date = Date('Y-m-d', strtotime($last_sequence->start_date."+1 days"));

                    }
                    else{
                        $date = Date('Y-m-d', strtotime($last_sequence->start_date."+1 days"));
                        
                    }
                    // $date = Date('Y-m-d', strtotime($last_sequence->end_date."+{$sequence['wait_time']} days"));
                    if (!$date)
                    {
                        $date = $time;
                    }
                    $this->addNewSequence($sequence,$dripCampaign,$date,++$key);
                }
                $previous_wait_time += $sequence['wait_time'];

                $testarr[] = $sequence; 
            }

            // DB::commit();

            //  $deleted_sequence = array_diff($exiting_sequence_id,$upcomming_sequence_id);

            // return response()->json([
            //         'status'    => 'success',
            //         'existing'    => $exiting_sequence_id,
            //         'upcoming'    => $upcomming_sequence_id,
            //         'deleted_seq' => $deleted_sequence,
            //         'data'      => $testarr,
                    
            //     ], 200);
            
            $deleted_sequence = array_diff($exiting_sequence_id,$upcomming_sequence_id);
            foreach ($deleted_sequence as $toDelete)
            {
                DripSequence::find($toDelete)->delete();
            }

            $this->addCampaignUrl($dripCampaign->id);

            DB::commit();
            return response()->json([
                'status'    => 'success',
                'data'      => $dripCampaign->id,
                'message'   => $this->title . ' updated successfully.'
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => $e->getMessage()
            ],403);
        }
    }
    public function updateSequece($sequence,$time,$status,$previous_wait_time,$position)
    {
        $db_sequence = DripSequence::find($sequence['id']);
        if ($time)
        {
            $time = Carbon::parse($time)->addDays($previous_wait_time);
            $db_sequence->update([
                'wait_time'     => $sequence['wait_time'],
                'sq_subject'    => $sequence['sq_subject'] ,
                'sq_body'       => $sequence['sq_body'],
                // 'start_date'    => $time,
                // 'end_date'      => Date('Y-m-d', strtotime($time."+{$sequence['wait_time']} days")),
                'status'        => $status,
                'position'      => $position,
            ]);
        }
        else{
            $db_sequence->update([
                'wait_time'     => $sequence['wait_time'],
                'sq_subject'    => $sequence['sq_subject'] ,
                'sq_body'       => $sequence['sq_body'],
                'position'      => $position,
            ]);
        }

    }

    public function addNewSequence($sequence, $campaign,$startTime,$position)
    {
        $rows = [
            'sq_uid'        => Str::uuid(),
            'drip_id'       => $campaign->id,
            'wait_time'     => $sequence['wait_time'],
            'sq_subject'    => $sequence['sq_subject'] ,
            'sq_body'       => $sequence['sq_body'],
            'start_date'    => $startTime,
            'end_date'      => Date('Y-m-d', strtotime($startTime."+{$sequence['wait_time']} days")),
            'status'        => 1,
            'position'      => $position,
            'created_at'    => now(),
            'updated_at'    => now(),
        ];

        DripSequence::insert($rows);
        $addDays = $sequence['wait_time'];
        $startTime = Date('Y-m-d', strtotime($startTime."+{$addDays} days"));
    }
    protected function updateSubscriber($data,$list_id)
    {
        $emails = $existing_emails = [];
        $data['duplicate_status'] = 1;

        if (array_key_exists('duplicate_status',$data) && $data['duplicate_status'] == 1)
        {
            $existing_emails =  EmailListSubscriber::where(function ($query) use($data){
                $query->whereIn('email',array_column($data['email_subscribers'], 'email'))
                    ->orWhereIn('email',array_column($data['email_subscribers'], 'Email'));
            })->where('list_id',$list_id)->pluck('email')->toArray();
        }

        $duplicates = $i = 0;
        $key = '';

        foreach ($data['email_subscribers'] as $datum)
        {
            if ($i == 0)
            {
                $key = array_key_exists('email',$datum) ? 'email' : 'Email';
            }
            if (array_key_exists('duplicate_status',$data) && $data['duplicate_status'] == 1 && in_array($datum[$key],$existing_emails))
            {
                $duplicates++;
            }
            else{
                $emails[]               = [
                    'subscriber_uid'    => Str::uuid(),
                    'list_id'           => $list_id,
                    'email'             => $datum[$key],
                    'other'             => json_encode($datum),
                    'created_at'        => now(),
                    'updated_at'        => now(),
                ];
            }
            $i++;
        }

        $chunks = array_chunk($emails,1000);

        foreach ($chunks as $chunk)
        {
            EmailListSubscriber::insert($chunk);
        }

        if (array_key_exists('duplicate_status',$data) && $data['duplicate_status'] == 1 && $duplicates > 0)
        {
            $msg ="Found ". $duplicates. " duplicate, ". count($chunks). " were imported";
        }
        else{
            $msg = 'Leads imported successfully';
        }

        return count($emails);
    }
    public function destroy(Request $request): \Illuminate\Http\JsonResponse
    {
        DB::beginTransaction();
        try {
            if (is_array($request->drip_id)) {
                $drip_ids = $request->drip_id;
            } else {
                $drip_ids = [$request->drip_id];
            }
            DripSequence::whereIn('drip_id', $drip_ids)->delete();
            TimeFilter::whereIn('drip_id', $drip_ids)->delete();
            DripCampaign::destroy($drip_ids);

            DB::commit();
            return response()->json(['status' => 'success', 'message' => 'Campaign deleted successfully.'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Something Went Wrong'
            ],403);
        }
    }
    public function emilRespondSend(Request $request, $tenant_id)
    {
        $validator = Validator::make($request->all(), [
            'drip_id' => 'required',
            'reply_id' => 'required',
            'from_name' => 'required',
            'from_email' => 'required',
            'email_body' => 'required'
        ] );

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'error' => $validator->errors()
            ], 422);
        }

        DripRespond::create(['reply_id' =>$request->drip_id, 'from_name' => $request->from_name, 'from_email' => $request->from_email, 'email_body' => $request->email_body]);

        DripRespondJob::dispatch($tenant_id, $request->drip_id, $request->reply_id, $request->from_name, $request->from_email, $request->email_body);

        return response()->json(['status' => 'success', 'message' => 'Reply send successfully'], 201);
    }
    public function status(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'status' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'error' => $validator->errors()
            ], 422);
        }

        try {
            $campaign = DripCampaign::find($request->id);
            if (!$campaign) {
                return response()->json([
                    'error' => 'Something Went Wrong'
                ]);
            }
            $campaign->status = $request->status;
            $campaign->save();
            return response()->json(['status' => 'success', 'message' => 'Status Updated successfully'], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something Went Wrong'
            ],403);
        }
    }
    public function sendEmail(Request $request)
    {
        $validator      = Validator::make($request->all(), [
            'to_mail'   => 'required',
            'from_mail' => 'required',
            'subject'   => 'required',
            'body'      => 'required'
        ]);

        if ($validator->fails())
        {
            return response()->json([
                'status' => 'error',
                'error' => $validator->errors()
            ], 422);
        }

        try {
            $sender_info = EmailAccount::where('smtp_from_email', $request->from_mail)->first();
            if (!$sender_info) {
                return response()->json([
                    'error' => 'Email Account Not Found'
                ],403);
            }
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
                            'address' => $request->from_mail,
                            'name' => $sender_info->smtp_from_name,
                        ],
                    // 'mail.mailers.' . $temp_config_name . '.auth_mode' => 'smt',
                ]]
            ];
            config()->set($stmp);
            // $repo           = new CampaignRepository();
            // $parsed_data    = $repo->changeUserInfo($email->other,$send_info->smtp_from_name,$request->subject,$html);
            // $subject        = $parsed_data['subject'];
            // $html           = $parsed_data['html'];
            // $link           = SubscribeLink::first();
            // $link           = $link ? 'https://'.$link->url : '';
            // $html           = str_replace('href="#unsubscribe"',"href=$link/api/drip_campaign/unsubscribe-email/$this->tenet_id/$email->list_id/$email->email",$html);


            $attribute      = [
                'from'      => $request->from_mail,
                'subject'   => $request->subject,
                'content'   => $request->body,
                'campaign'  => null,
                'view'      => 'emails.drip_campaign_mail',
            ];

            Mail::mailer('user_stmp')->to($request->to_mail)->send(new SendSmtpMail($attribute));
            return response()->json(['status' => 'success', 'message' => 'Mail Sent successfully'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ],403);
        }
    }
    public function unsubscribeView($tenant_id,$list_id,$email)
    {
        $tenant = Tenant::find($tenant_id);
        $db_count = tenant_db_name::where('tenant_id', $tenant->id)->first();
        if ($db_count) {
            Config::set('tenancy.database.template_tenant_connection', $db_count->db_con_use);
            DB::purge('tenant');
            Config::set('database.connections.tenant.host', env('DB_HOST'));
            Config::set('database.connections.tenant.username', env('DB_USERNAME'));
            Config::set('database.connections.tenant.password', env('DB_PASSWORD'));
            Config::set('database.connections.tenant.database', $tenant->tenancy_db_name);
            Config::set('database.default', 'tenant');
            DB::reconnect('tenant');
        }
        $subscriber = EmailListSubscriber::where('list_id',$list_id)->where('email',$email)->first();
        if ($subscriber->status != 1)
        {
            session()->flash('unsubscribed',1);
        }
        $data = [
            'subscriber' => $subscriber,
            'tenant_id' => $tenant_id
        ];

        return view('api.unsubscribe',$data);
    }

    public function unsubscribe($tenant_id,$subscriber_id)
    {
        try {
            $tenant = Tenant::find($tenant_id);
            $db_count = tenant_db_name::where('tenant_id', $tenant->id)->first();
            if ($db_count) {
                Config::set('tenancy.database.template_tenant_connection', $db_count->db_con_use);
                DB::purge('tenant');
                Config::set('database.connections.tenant.host', env('DB_HOST'));
                Config::set('database.connections.tenant.username', env('DB_USERNAME'));
                Config::set('database.connections.tenant.password', env('DB_PASSWORD'));
                Config::set('database.connections.tenant.database', $tenant->tenancy_db_name);
                Config::set('database.default', 'tenant');
                DB::reconnect('tenant');
            }
            $subscriber = EmailListSubscriber::find($subscriber_id);
            $campaign = DripCampaign::where('list_id', $subscriber->list_id)->first();
            if ($campaign) {
                $campaign->total_mail_send = $campaign->total_mail_send - 1;
                $campaign->save();
            }
            if ($subscriber) {
                $subscriber->subscriber = 0;
                $subscriber->save();
            }
            return view('api.unsubscribed');
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }
    public function trackOpen($tenant_id,$list_id,$email,$smtp_id,$sequence_id)
    {
        DB::beginTransaction();
        try {
            $tenant = Tenant::find($tenant_id);
            $db_count = tenant_db_name::where('tenant_id', $tenant->id)->first();
            if ($db_count){
                Config::set('tenancy.database.template_tenant_connection', $db_count->db_con_use);
                DB::purge('tenant');
                Config::set('database.connections.tenant.host', env('DB_HOST'));
                Config::set('database.connections.tenant.username', env('DB_USERNAME'));
                Config::set('database.connections.tenant.password', env('DB_PASSWORD'));
                Config::set('database.connections.tenant.database', $tenant->tenancy_db_name);
                Config::set('database.default', 'tenant');
                DB::reconnect('tenant');
            }
            $campaign = DripCampaign::where('list_id', $list_id)->first();
            $subscriber = EmailListSubscriber::where('list_id', $list_id)->where('email', $email)->first();
            if (!$campaign || !$subscriber) {
                Log::info("campaign or subscriber not found in open event for $list_id & $email");
                return false;
            }
            $already_opened = DripOpen::where('drip_id', $campaign->id)->where('subscriber_id', $subscriber->id)->where('sequence_id', $sequence_id)->first();
            if ($already_opened) {
                $already_opened->increment('count');
            } else {
                $data = [
                    'drip_id'       => $campaign->id,
                    'smtp_id'       => $smtp_id,
                    'sequence_id'   => $sequence_id,
                    'subscriber_id' => $subscriber->id,
                    'count'         => 1,
                ];
                DripOpen::create($data);
                dd($data);
            }
            $img = Image::canvas(1, 1, '#FFFFFF');
            DB::commit();
            return $img->response('png');
        } catch (\Exception $e) {
            DB::rollBack();
            return false;
        }
    }
    public function trackClick(Request $request)
    {
        DB::beginTransaction();
        try {
            $tenant = Tenant::find($request->user_tenant_id);
            $db_count = tenant_db_name::where('tenant_id', $tenant->id)->first();
            if ($db_count){
                Config::set('tenancy.database.template_tenant_connection', $db_count->db_con_use);
                DB::purge('tenant');
                Config::set('database.connections.tenant.host', env('DB_HOST'));
                Config::set('database.connections.tenant.username', env('DB_USERNAME'));
                Config::set('database.connections.tenant.password', env('DB_PASSWORD'));
                Config::set('database.connections.tenant.database', $tenant->tenancy_db_name);
                Config::set('database.default', 'tenant');
                DB::reconnect('tenant');
            }

            $list_id    = $request->list_id;
            $email      = $request->email;
            $campaign   = DripCampaign::where('list_id', $list_id)->first();
            $subscriber = EmailListSubscriber::where('list_id', $list_id)->where('email', $email)->first();

            if (!$campaign || !$subscriber) {
                if ($request->url)
                {
                    return redirect()->away($request->url);
                }
                else{
                    return false;
                }
            }
            $already_clicked = DripClick::where('drip_id', $campaign->id)->where('subscriber_id', $subscriber->id)->where('sequence_id', $request->sequence_id)->first();

            if ($already_clicked) {
                $already_clicked->increment('count');
            } else {
                $data               = [
                    'drip_id'       => $campaign->id,
                    'subscriber_id' => $subscriber->id,
                    'sequence_id'   => $request->sequence_id,
                    'count'         => 1,
                ];
                DripClick::create($data);
            }

            DB::commit();

            return redirect()->away($request->url);
        } catch (\Exception $e) {
            DB::rollBack();
            return false;
        }
    }

    public function analyticsList(): \Illuminate\Http\JsonResponse
    {
        try {
            $campaigns      = DripCampaign::withCount('opens')->withCount('emailSubscribers')
                ->withCount('emails')->withCount('opens')
                ->get();

            $account        = EmailAccount::withCount('EmailSent')->withCount('threads')->withCount('open')->latest()->where('user_id', auth()->id())->get();

            $data           = [
                'campaigns'     => CampaignResource::collection($campaigns),
                'email_account' => $account,
                'success'   => 'Data Retrieved Successfully',
            ];

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something Went Wrong'
            ],403);
        }
    }

    public function analyticsCounters(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $campaign_date  = Carbon::parse($request->start_date);
            $end_date       = Carbon::parse($request->end_date);

            $open_counter               = DripOpen::when($request->start_date && $request->end_date ,function ($query) use($campaign_date,$end_date){
                $query->whereBetween('created_at', [$campaign_date->format('Y-m-d') . ' 00:00:00', $end_date->format('Y-m-d') . ' 23:59:59']);
            })->count();
            $reply_counter              = UniboxThread::when($request->start_date && $request->end_date ,function ($query) use($campaign_date,$end_date){
                $query->whereBetween('created_at', [$campaign_date->format('Y-m-d') . ' 00:00:00', $end_date->format('Y-m-d') . ' 23:59:59']);
            })->count();
            $click_counter              = DripClick::when($request->start_date && $request->end_date ,function ($query) use($campaign_date,$end_date){
                $query->whereBetween('created_at', [$campaign_date->format('Y-m-d') . ' 00:00:00', $end_date->format('Y-m-d') . ' 23:59:59']);
            })->count();
            $unsubscribes_counter       = EmailListSubscriber::when($request->start_date && $request->end_date ,function ($query) use($campaign_date,$end_date){
                $query->whereBetween('created_at', [$campaign_date->format('Y-m-d') . ' 00:00:00', $end_date->format('Y-m-d') . ' 23:59:59']);
            })->where('status',0)->count();
            $contacts_counter           = DripEmail::when($request->start_date && $request->end_date ,function ($query) use($campaign_date,$end_date){
                $query->whereBetween('created_at', [$campaign_date->format('Y-m-d') . ' 00:00:00', $end_date->format('Y-m-d') . ' 23:59:59']);
            })->where('status',1)->count();

            $data                       = [
                'total_sent'            => $contacts_counter >= 1000 ? $contacts_counter/1000 . 'K' : $contacts_counter,
                'total_clicked'         => $click_counter >= 1000 ? $click_counter/1000 . 'K' : $click_counter,
                'total_opened'          => $open_counter >= 1000 ? $open_counter/1000 . 'K' : $open_counter,
                'total_replied'         => $reply_counter >= 1000 ? $reply_counter/1000 . 'K' : $reply_counter,
                'total_unsubscribed'    => $unsubscribes_counter >= 1000 ? $unsubscribes_counter/1000 . 'K' : $unsubscribes_counter,
                'success'               => 'Data Retrieved Successfully',
            ];

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something Went Wrong'
            ],403);
        }
    }

    public function analyticsStats(Request $request): \Illuminate\Http\Response|\Illuminate\Http\JsonResponse|\Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory
    {
        try {
            $categories = $all_opens = $all_replies = $all_clicks = $all_unsubscribes = $all_contacts = [];
            $campaign_date = Carbon::parse($request->start_date);
            $end_date = Carbon::parse($request->end_date);
            $diff_in_days = $campaign_date->diffInDays($request->end_date) + 1;
            if ($diff_in_days <= 31) {
                $date_range = $campaign_date->daysUntil($end_date->addDays(1));
                $dates      = [];

                foreach ($date_range as $date)
                {
                    $categories[]   = $date->format('d M');
                    $dates[]        = $date->format('Y-m-d');
                }

                $opens = DripOpen::when($request->start_date && $request->end_date ,function ($query) use($campaign_date,$end_date){
                    $query->whereBetween('created_at', [$campaign_date->format('Y-m-d') . ' 00:00:00', $end_date->format('Y-m-d') . ' 23:59:59']);
                })->selectRaw('DATE_FORMAT(created_at, "%Y-%m-%d") as date,COUNT(*) as total_count')->groupBy('date')->pluck('total_count', 'date')->toArray();

                $replies = UniboxThread::when($request->start_date && $request->end_date ,function ($query) use($campaign_date,$end_date){
                    $query->whereBetween('created_at', [$campaign_date->format('Y-m-d') . ' 00:00:00', $end_date->format('Y-m-d') . ' 23:59:59']);
                })->selectRaw('DATE_FORMAT(created_at, "%Y-%m-%d") as date,COUNT(*) as total_count')->groupBy('date')->pluck('total_count', 'date')->toArray();

                $clicks = DripClick::when($request->start_date && $request->end_date ,function ($query) use($campaign_date,$end_date){
                    $query->whereBetween('created_at', [$campaign_date->format('Y-m-d') . ' 00:00:00', $end_date->format('Y-m-d') . ' 23:59:59']);
                })->selectRaw('DATE_FORMAT(created_at, "%Y-%m-%d") as date,COUNT(count) as total_count')->groupBy('date')->pluck('total_count', 'date')->toArray();

                $unsubscribes = EmailListSubscriber::where('status', 0)
                    ->when($request->start_date && $request->end_date ,function ($query) use($campaign_date,$end_date){
                        $query->whereBetween('updated_at', [$campaign_date->format('Y-m-d') . ' 00:00:00', $end_date->format('Y-m-d') . ' 23:59:59']);
                    })->selectRaw('DATE_FORMAT(updated_at, "%Y-%m-%d") as date,COUNT(*) as total_count')->groupBy('date')->pluck('total_count', 'date')->toArray();

                $contacts = DripEmail::when($request->start_date && $request->end_date ,function ($query) use($campaign_date,$end_date){
                    $query->whereBetween('created_at', [$campaign_date->format('Y-m-d') . ' 00:00:00', $end_date->format('Y-m-d') . ' 23:59:59']);
                })->where('status',1)->selectRaw('DATE_FORMAT(created_at, "%Y-%m-%d") as date,COUNT(*) as total_count')->groupBy('date')->pluck('total_count', 'date')->toArray();

                foreach ($dates as $new_date)
                {
                    $all_opens[$new_date]           = in_array($new_date, array_keys($opens)) ? (int)$opens[$new_date] : 0;
                    $all_replies[$new_date]         = in_array($new_date, array_keys($replies)) ? (int)$replies[$new_date] : 0;
                    $all_clicks[$new_date]          = in_array($new_date, array_keys($clicks)) ? (int)$clicks[$new_date] : 0;
                    $all_unsubscribes[$new_date]    = in_array($new_date, array_keys($unsubscribes)) ? (int)$unsubscribes[$new_date] : 0;
                    $all_contacts[$new_date]        = in_array($new_date, array_keys($contacts)) ? (int)$contacts[$new_date] : 0;
                }
            } elseif ($diff_in_days <= 366) {
                $current_date = $campaign_date->copy()->startOfMonth();

                while ($current_date->lessThanOrEqualTo($end_date))
                {
                    $categories[] = $current_date->format('M Y');
                    $current_date->addMonth();
                }

                $opens = DripOpen::when($request->start_date && $request->end_date ,function ($query) use($campaign_date,$end_date){
                    $query->whereBetween('created_at', [$campaign_date->format('Y-m-d') . ' 00:00:00', $end_date->format('Y-m-d') . ' 23:59:59']);
                })->selectRaw('DATE_FORMAT(created_at, "%b %Y") as date,MONTH(created_at) as month,COUNT(count) as total_count')->groupBy('month')->pluck('total_count', 'date')->toArray();

                $replies = UniboxThread::when($request->start_date && $request->end_date ,function ($query) use($campaign_date,$end_date){
                    $query->whereBetween('created_at', [$campaign_date->format('Y-m-d') . ' 00:00:00', $end_date->format('Y-m-d') . ' 23:59:59']);
                })->selectRaw('DATE_FORMAT(created_at, "%b %Y") as date,MONTH(created_at) as month,COUNT(*) as total_count')->groupBy('month')->pluck('total_count', 'date')->toArray();

                $clicks = DripClick::when($request->start_date && $request->end_date ,function ($query) use($campaign_date,$end_date){
                    $query->whereBetween('created_at', [$campaign_date->format('Y-m-d') . ' 00:00:00', $end_date->format('Y-m-d') . ' 23:59:59']);
                })->selectRaw('DATE_FORMAT(created_at, "%b %Y") as date,MONTH(created_at) as month,COUNT(count) as total_count')->groupBy('month')->pluck('total_count', 'date')->toArray();

                $unsubscribes = EmailListSubscriber::when($request->start_date && $request->end_date ,function ($query) use($campaign_date,$end_date){
                    $query->whereBetween('updated_at', [$campaign_date->format('Y-m-d') . ' 00:00:00', $end_date->format('Y-m-d') . ' 23:59:59']);
                })->where('status', 0)->selectRaw('DATE_FORMAT(updated_at, "%b %Y") as date,MONTH(updated_at) as month,COUNT(*) as total_count')->groupBy('month')->pluck('total_count', 'date')->toArray();

                $contacts = DripEmail::when($request->start_date && $request->end_date ,function ($query) use($campaign_date,$end_date){
                    $query->whereBetween('created_at', [$campaign_date->format('Y-m-d') . ' 00:00:00', $end_date->format('Y-m-d') . ' 23:59:59']);
                })->where('status',1)->selectRaw('DATE_FORMAT(created_at, "%b %Y") as date,MONTH(created_at) as month,COUNT(*) as total_count')->groupBy('month')->pluck('total_count', 'date')->toArray();

                foreach ($categories as $new_date)
                {
                    $all_opens[$new_date]           = in_array($new_date, array_keys($opens)) ? (int)$opens[$new_date] : 0;
                    $all_replies[$new_date]         = in_array($new_date, array_keys($replies)) ? (int)$replies[$new_date] : 0;
                    $all_clicks[$new_date]          = in_array($new_date, array_keys($clicks)) ? (int)$clicks[$new_date] : 0;
                    $all_unsubscribes[$new_date]    = in_array($new_date, array_keys($unsubscribes)) ? (int)$unsubscribes[$new_date] : 0;
                    $all_contacts[$new_date]        = in_array($new_date, array_keys($contacts)) ? (int)$contacts[$new_date] : 0;
                }
            } else {
                $start_year = $campaign_date->year;
                $end_year   = $end_date->year;

                for ($year = $start_year; $year <= $end_year; $year++)
                {
                    $formatted_year = \Carbon\Carbon::create($year, 1, 1)->format('Y');
                    $categories[]   = $formatted_year;
                }

                $opens = DripOpen::when($request->start_date && $request->end_date ,function ($query) use($campaign_date,$end_date){
                    $query->whereBetween('created_at', [$campaign_date->format('Y-m-d') . ' 00:00:00', $end_date->format('Y-m-d') . ' 23:59:59']);
                })->selectRaw('DATE_FORMAT(created_at, "%Y") as date,YEAR(created_at) as year,COUNT(count) as total_count')->groupBy('year')->pluck('total_count', 'date')->toArray();

                $replies = UniboxThread::when($request->start_date && $request->end_date ,function ($query) use($campaign_date,$end_date){
                    $query->whereBetween('created_at', [$campaign_date->format('Y-m-d') . ' 00:00:00', $end_date->format('Y-m-d') . ' 23:59:59']);
                })->selectRaw('DATE_FORMAT(created_at, "%Y") as date,YEAR(created_at) as year,COUNT(*) as total_count')->groupBy('year')->pluck('total_count', 'date')->toArray();

                $clicks = DripClick::when($request->start_date && $request->end_date ,function ($query) use($campaign_date,$end_date){
                    $query->whereBetween('created_at', [$campaign_date->format('Y-m-d') . ' 00:00:00', $end_date->format('Y-m-d') . ' 23:59:59']);
                })->selectRaw('DATE_FORMAT(created_at, "%Y") as date,YEAR(created_at) as year,COUNT(count) as total_count')->groupBy('year')->pluck('total_count', 'date')->toArray();

                $unsubscribes = EmailListSubscriber::when($request->start_date && $request->end_date ,function ($query) use($campaign_date,$end_date){
                    $query->whereBetween('updated_at', [$campaign_date->format('Y-m-d') . ' 00:00:00', $end_date->format('Y-m-d') . ' 23:59:59']);
                })->where('status', 0)->selectRaw('DATE_FORMAT(updated_at, "%Y") as date,YEAR(updated_at) as year,COUNT(*) as total_count')->groupBy('year')->pluck('total_count', 'date')->toArray();

                $contacts = DripEmail::when($request->start_date && $request->end_date ,function ($query) use($campaign_date,$end_date){
                    $query->whereBetween('created_at', [$campaign_date->format('Y-m-d') . ' 00:00:00', $end_date->format('Y-m-d') . ' 23:59:59']);
                })->where('status',1)->selectRaw('DATE_FORMAT(created_at, "%Y") as date,YEAR(created_at) as year,COUNT(*) as total_count')->groupBy('year')->pluck('total_count', 'date')->toArray();

                foreach ($categories as $new_date)
                {
                    $all_opens[$new_date]           = in_array($new_date, array_keys($opens)) ? (int)$opens[$new_date] : 0;
                    $all_replies[$new_date]         = in_array($new_date, array_keys($replies)) ? (int)$replies[$new_date] : 0;
                    $all_clicks[$new_date]          = in_array($new_date, array_keys($clicks)) ? (int)$clicks[$new_date] : 0;
                    $all_unsubscribes[$new_date]    = in_array($new_date, array_keys($unsubscribes)) ? (int)$unsubscribes[$new_date] : 0;
                    $all_contacts[$new_date]        = in_array($new_date, array_keys($contacts)) ? (int)$contacts[$new_date] : 0;
                }
            }

            $data['analytics']  = [
                'categories'    => $categories,
                'opens'         => array_values($all_opens),
                'replies'       => array_values($all_replies),
                'clicks'        => array_values($all_clicks),
                'unsubscribes'  => array_values($all_unsubscribes),
                'contacts'      => array_values($all_contacts),
                'success'       => 'Graph retrieved successfully'
            ];

            return response($data);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something Went Wrong'
            ],403);
        }
    }

    public function campaignClone(Request $request)
    {
        try {
            DB::beginTransaction();
            $campaigns = DripCampaign::with('timeFilter','sequences')->whereIn('id', $request->ids)->get();
            foreach ($campaigns as $campaign) {
                $email_accounts = EmailAccount::whereIn('id',$campaign->smtp_id)->get();
                $drip               = DripCampaign::create([
                    'user_id'       => auth()->id(),
                    'dirp_uid'      => Str::uuid(),
                    'status'        => 0,
                    'campaign_name' => $campaign->campaign_name .' Cloned',
                    'from_name'     => $campaign->from_name,
                    'from_email'    => $email_accounts->pluck('smtp_from_name')->toArray(),
                    'subject'       => $campaign->subject,
                    'list_id'       => 0,
                    'smtp_id'       => $campaign->smtp_id,
                    'email_body'    => $campaign->email_body,
                    'delay_email'   => $campaign->delay_email,
                    'max_email'     => $campaign->max_email,
                    'tracking'      => $campaign->tracking,
                    'started_at'    => null,
                    'finished_at'   => null,
                    'stop_on_reply' => $campaign->stop_on_reply,
                ]);

                $time_filter = $campaign->timeFilter;

                TimeFilter::create([
                    'drip_id'       => $drip->id,
                    'days'          => $time_filter->days,
                    'start_at'      => $time_filter->start_at,
                    'stop_at'       => $time_filter->stop_at,
                    'time_zone'     => $time_filter->time_zone,
                    'start_date'    => null
                ]);

//                $startTime = date('Y-m-d');
                foreach ($campaign->sequences as $sequence) {
                    $data   = [
                        'sq_uid'            => Str::uuid(),
                        'drip_id'           => $drip->id,
                        'wait_time'         => $sequence->wait_time,
                        'sq_subject'        => $sequence->sq_subject,
                        'sq_body'           => $sequence->sq_body,
                        'start_date'        => null,
                        'end_date'          => null,
                        'status'            => 1,
                    ];
                    DripSequence::create($data);
                    /*$addDays = $sequence['wait_time'];
                    $startTime = Date('Y-m-d', strtotime($startTime."+{$addDays} days"));*/
                }

            }
            DB::commit();
            return response()->json([
                'success' => 'Campaign Cloned Successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => $e->getMessage()
            ],403);
        }
    }

    public function check_duplicate(Request $request)
    {
        try {
            $existing_emails_array = [];
            $email_limit = 15000;


            $subscribersList = is_string($request->email_subscribers) ? json_decode($request->email_subscribers,true) : $request->email_subscribers;
            $plan = user_plan::where('status',1)->first();

            if ($plan)
            {
                $email_limit = $plan->plan_number_users;
            }

            // Check if the "email" key exists in any sub-array
            $emailExists = $this->any(array_column($subscribersList, 'email'));

            if($emailExists){

                if ($request['duplicate_status'] == 1)
                {
                    $existing_emails = DripCampaign::where('drip_campaigns.status', 1)
                        ->join('email_lists', 'drip_campaigns.list_id', '=', 'email_lists.id')
                        ->join('email_list_subscribers', 'email_lists.id', '=', 'email_list_subscribers.list_id')
                        ->distinct()
                        ->pluck('email_list_subscribers.email')
                        ->toArray();
                    /*$existing_emails =  EmailListSubscriber::where(function ($query) use ($subscribersList){
                        $query->whereIn('email',array_column($subscribersList, 'email'))
                            ->orWhereIn('email',array_column($subscribersList, 'Email'));
                    })->distinct()->pluck('email')->toArray();*/

                    // Convert to a collection and use unique method
                    // $unique_emails = collect($existing_emails)->unique()->values()->toArray();
                } else {
                    $existing_emails = DripCampaign::join('email_lists', 'drip_campaigns.list_id', '=', 'email_lists.id')
                    ->join('email_list_subscribers', 'email_lists.id', '=', 'email_list_subscribers.list_id')
                    ->distinct()
                    ->pluck('email_list_subscribers.email')
                    ->toArray();
                }

                 $duplicates = $i = 0;
                 $key = '';

                foreach ($subscribersList as $datum)
                {
                    if ($i == 0)
                    {
                        $key = array_key_exists('email',$datum) ? 'email' : 'Email';
                    }
                    if ($request['duplicate_status'] == 1 && in_array($datum[$key],$existing_emails))
                    {
                        $duplicates++;
                    }
                }
            }
            else{

                $email_key = $this->findEmailKey($subscribersList[1]);

                if ($request['duplicate_status'] == 1) {
                     // Assuming the email key is the same for all subscribers
                    $existing_emails = DripCampaign::where('drip_campaigns.status', 1)
                        ->join('email_lists', 'drip_campaigns.list_id', '=', 'email_lists.id')
                        ->join('email_list_subscribers', 'email_lists.id', '=', 'email_list_subscribers.list_id')
                        ->distinct()
                        ->pluck('email_list_subscribers.email')
                        ->toArray();

                    // Convert to a collection and use unique method
                    // $unique_emails = collect($existing_emails)->unique()->values()->toArray();
                } else {
                    $existing_emails = DripCampaign::join('email_lists', 'drip_campaigns.list_id', '=', 'email_lists.id')
                    ->join('email_list_subscribers', 'email_lists.id', '=', 'email_list_subscribers.list_id')
                    ->distinct()
                    ->pluck('email_list_subscribers.email')
                    ->toArray();
                }

                 $duplicates = $i = 0;
                 $key = '';

                 foreach ($subscribersList as $datum) {
                    if ($request['duplicate_status'] == 1 && in_array($datum[$email_key], $existing_emails)) {
                        $duplicates++;
                    }
                }
            }

        


//            find distinct email
            $totalEmail = EmailListSubscriber::distinct('email')->count();

            if ($request['duplicate_status'] == 1 && $duplicates > 0)
            {
                $total_imported = count($subscribersList) - $duplicates;
                $msg ="Found ". $duplicates. " duplicate, ". $total_imported. " will be imported";
                if($totalEmail+(count($subscribersList)-$duplicates) > $email_limit)
                {
                    return response([
                        'status'            => 'success',
                        'existing_emails'   => !empty($existing_emails) ? $existing_emails : [],
                        'duplicate_message' => $msg,
                        'limit_message'     => 'Plan email list exceeds',
                        'permission'        => 0,
                        'email_limit'       => number_format($email_limit),
                    ],200);
                }
                else{
                    return response([
                        'status'            => 'success',
                        'existing_emails'   => !empty($existing_emails) ? $existing_emails : [],
                        'duplicate_message' => $msg,
                        'permission'        => 1,//1
                        'email_limit'       => number_format($email_limit),
                    ],200);
                }
            }
            else if($totalEmail+(count($subscribersList)-$duplicates) > $email_limit){
                $msg ="Found ". $duplicates. " duplicate";
                return response([
                    'status'            => 'success',
                    'existing_emails'   => !empty($existing_emails) ? $existing_emails : [],
                    'duplicate_message' => $msg,
                    'limit_message'     => 'Plan email list exceeds',
                    'permission'        => 0,
                    'email_limit'       => number_format($email_limit),
                ],200);
            }else
            {
                return response([
                    'status'            => 'success',
                    'existing_emails'   => !empty($existing_emails) ? $existing_emails : [],
                    'duplicate_message' => 'All mails imported',
                    'limit_message'     => '',
                    'permission'        => 1,//1
                    'email_limit'       => number_format($email_limit),
                ],200);
            }
        }
        catch (\Exception $e)
        {
            return response()->json([
                'error' => $e->getMessage(),
            ], 403);
        }
    }

    private function any($array) {
        return array_reduce($array, function ($carry, $item) {
            return $carry || $item;
        }, false);
    }

    private function findEmailKey($datum)
    {
        foreach ($datum as $key => $value) {

            if (filter_var($value, FILTER_VALIDATE_EMAIL)) {
                return $key;
            }
        }

        // If no email key is found, you may want to handle this case based on your requirements
        return null;
    }

    public function parseCSV(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'csv_file'  => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'error' => $validator->errors()
            ], 422);
        }

        try {
            $line_of_text = [];
            $file_handle = fopen($request->csv_file, 'r');
            while (!feof($file_handle)) {
                $line_of_text[] = fgetcsv($file_handle, 0);
            }
            fclose($file_handle);
            if (count($line_of_text) == 0) {
                return response()->json([
                    'error' => 'No rows found In List'
                ],403);
            }

            $common_fields = [
                'First Name',
                'Last Name',
                'Email',
                'Job Title',
                'State',
                'Country',
                'City',
                'Company',
            ];

            $headers        = $line_of_text[0];
            $missing_keys   = array_diff($headers, $common_fields);
            foreach ($missing_keys as $key => $value) {
                if (stripos($value, 'email') !== false) {
                    unset($missing_keys[$key]);
                }
            }
            $all_fields     = array_merge($common_fields,$missing_keys);
            $all_fields[]   = 'Custom';

            unset($line_of_text[0]);

            $data = [
                'common_fields' => $all_fields,
                'subscribers'   => array_filter($line_of_text),
                'headers'       => $headers,
            ];

            return response()->json($data);
        }
        catch (\Exception $e)
        {
            return response()->json([
                'error' => $e->getMessage()
            ], 403);
        }
    }

    public function setCsvFileWithKey(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator          = Validator::make($request->all(),[
            'header'        => 'required',
            'subscribers'   => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'    => 'error',
                'error'     => $validator->errors()
            ], 422);
        }

        try{
            $subscribersList = [];

            $valueToRemove = 'do_not_import';

            $headers = [];
            foreach ($request->header as $item)
            {
                $headers[] = lcfirst($item);
            }

            $keysToRemove = array_keys($headers, $valueToRemove);

            $headers = array_filter($headers, function ($value) use ($valueToRemove){
                if (empty($value)) {
                    return false;
                }
                return $value !== $valueToRemove;
            });

            $subscribers = is_string($request->subscribers) ? json_decode($request->subscribers, true) : $request->subscribers;

            $subscribers = collect($subscribers)->map(function ($subArray) use ($keysToRemove) {
                return collect($subArray)->forget($keysToRemove)->toArray();
            })->toArray();
            
            foreach ($subscribers as $subscriber)
            {
                $subscribersList[] = array_combine($headers,$subscriber);
            }

            if ($request['check'] == "true") {
                $existing_emails = EmailListSubscriber::whereHas('campaign')->whereIn('email', collect($subscribersList)->pluck('email'))->pluck('email')->toArray();
                $subscribersList = collect($subscribersList)->reject(function ($subscriber) use ($existing_emails) {
                    return in_array($subscriber['email'], $existing_emails);
                })->toArray();
            } else {
                $subscribersList = $subscribers;
            }

            $data = [
                'subscribersList'   => $subscribersList,
                'total_subscribers' => count($subscribersList),
            ];

            return response()->json($data);
        }catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 403);
        }
    }

    public function addCampaignUrl($campaign_id)
    {
        $sequences = DripSequence::where('drip_id',$campaign_id)->get();
        $links = [];
        foreach ($sequences as $sequence) {
            $body = $sequence->sq_body;
            $links = array_merge($links,$this->getLinks($body));
        }
        $cp = DripUrl::where('drip_id', $campaign_id)->get();
        $url = getUrl();
        $links = array_values(array_diff($links, ["#unsubscribe","$url/campaigns/new#unsubscribe"] ));
        if(count($cp)){
            for ($i=0; $i <count($links) ; $i++) {
                $con = true;
                foreach ($cp as $cp_value){
                    if($cp_value->destination == $links[$i]){
                        $con = false;
                    }
                }
                if($con){
                    DripUrl::create(['drip_id' => $campaign_id, 'hash' => Str::uuid()->toString(), 'destination' => $links[$i]]);
                }
            }
        } else {
            for ($i=0; $i <count($links) ; $i++) {
                DripUrl::create(['drip_id' => $campaign_id, 'hash' => Str::uuid()->toString(), 'destination' => $links[$i]]);
            }
        }
        return $links;
    }
    public function getLinks($body)
    {
        if(empty($body)){
            return [];
        }
        $dom = new \DOMDocument;
        $dom->loadHTML($body);
        $data = [];
        foreach ($dom->getElementsByTagName('a') as $node) {
            $data[] = $node->getAttribute('href');
        }
        return array_merge(array_unique($data));
    }

    public function emailPreview(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(),[
            'subscriber'    => 'required',
            'subject'       => 'required',
            'body'          => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'error' => $validator->errors()
            ], 422);
        }

        try {
            $key        = arrayCheck('email',$request->subscriber) ? 'email' : 'Email';
            $email      = $request->subscriber[$key];
            $subject    = $request->subject;
            $body       = $request->body;
            $mark_tag   = [];
            $marks_body = [];

            foreach ($request->subscriber as $key => $info) {
                $mark_tag[] = '{' . $key . "}";
                $marks_body[] = $info;
            }

            $subject    = str_replace($mark_tag, $marks_body, $subject);
            $body       = str_replace($mark_tag, $marks_body, $body);

            return response()->json([
                'email'     => $email,
                'subject'   => $subject,
                'body'      => $body
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ],403);
        }
    }
}
