<?php

namespace App\Http\Controllers\API\Emails;

use App\Http\Controllers\Controller;
use App\Http\Resources\EmailListResource;
use App\Http\Resources\SubscriberResource;
use App\Http\Resources\SubscriberWithCountersResource;
use App\Models\Emails\EmailList;
use App\Models\Emails\EmailListSubscriber;
use App\Models\user_plan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class EmailListController extends Controller
{

    public function index(): \Illuminate\Http\JsonResponse
    {
        $data = EmailList::with('getSubscriber')->latest()->where('user_id', auth()->id())->get();
        return response()->json([
            'status'    => 'success',
            'message'   => 'Email List loaded successfully.',
            'data'      => $data
        ], 200);
    }

    public function getEmaiList($t_id, $id): \Illuminate\Http\JsonResponse
    {
        $data = EmailList::with('getSubscriber')->find($id);
        return response()->json([
            'status' => 'success',
            'message' => 'Email List loaded successfully.',
            'data' => $data
        ], 200);
    }

    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(), ['list_name' => 'required']);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()
            ], 403);
        }

        $email_list = EmailList::create([
            'user_id' => auth()->id(),
            'list_uid' => Str::uuid(),
            'list_name' => $request->list_name
        ]);
        return response()->json([
            'status' => 'success',
            'message' => 'Email List created successfully.',
            'data' => $email_list->id
        ], 200);


    }

    public function update(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator      = Validator::make($request->all(), [
            'id'        => 'required|int|exists:email_lists,id',
            'list_name' => 'required'
        ]);

        if ($validator->fails())
        {
            return response()->json([
                'status'    => 'error',
                'error'     => $validator->errors()
            ], 422);
        }
        try {
            $emailList = EmailList::find($request->id);
            $emailList->update([
                'list_name' => $request->list_name
            ]);
            return response()->json([
                'status'    => 'success',
                'message'   => 'Email List updated successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'    => 'error',
                'error'     => 'Email List updated successfully.',
            ], 403);
        }
    }


    public function destroy(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required'
        ]);

        if ($validator->fails())
        {
            return response()->json([
                'status' => 'error',
                'error' => $validator->errors()
            ], 422);
        }

        try {
            EmailList::destroy($request->id);
            return response()->json([
                'status'    => 'success',
                'message'   => 'Email List delete successfully.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'    => 'error',
                'error'     => 'Email List updated successfully.',
            ], 403);
        }
    }


    public function getSubscriber($tenant_id,$list_id,Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $emailList = EmailList::find($list_id);
            if (!$emailList) {
                return response()->json(['status' => 'error', 'message' => 'Email List Not found'], 403);
            }
            $paginate = $request->page_size ? : 10;

            $data = EmailListSubscriber::with('campaign:id,list_id')->withSum('clicks as total_click','count')
                ->withSum('opens as total_open','count')->withCount('contacted')
                ->where('list_id', $list_id)->when($request->q,function ($query) use ($request){
                $query->where('email','LIKE','%'.$request->q.'%');
            })->paginate($paginate);

            return response()->json([
                'status'            => 'success',
                'message'           => 'Subscriber List loaded successfully.',
                'email_subscribers' => SubscriberWithCountersResource::collection($data),
                'total_rows'        => $data->total(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something Went Wrong'
            ]);
        }
    }

    public function createSubscriber(Request $request): \Illuminate\Http\JsonResponse
    {
        DB::beginTransaction();

        $validator = Validator::make($request->all(), ['list_name' => 'required']);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()
            ], 403);
        }

        try {
            $emails         = $existing_emails = [];
            $data           = $request->all();
            $email_limit    = 15000;
            $duplicates = 0;

            $subscribers = is_string($data['leadsData']) ? json_decode($data['leadsData'],true) : $data['leadsData'];

            if ($request->status == 1)
            {
                $existing_emails =  EmailListSubscriber::where('type','User Uploaded')->whereIn('email',array_column($subscribers, 'email'))->pluck('email')->toArray();
            }

            if ($request->status == 1)
            {
                foreach ($subscribers as $datum)
                {
                    if (in_array($datum['email'],$existing_emails))
                    {
                        $duplicates++;
                    }
                }
            }

            $plan = user_plan::where('status',1)->first();

            if ($plan)
            {
                $email_limit = $plan->plan_number_users;
            }


            $totalEmail     = EmailListSubscriber::distinct('email')->count();
            $imported_mails = count($subscribers) - $duplicates;

            if ($request->status == 1 && $duplicates > 0)
            {
                $msg            = "Found ". $duplicates. " duplicate, ". $imported_mails. " will be imported";

                if($totalEmail+$imported_mails > $email_limit)
                {
                    return response()->json([
                        'status' => 'success',
                        'duplicate_message' => $msg,
                        'limit_message' => 'Plan email list exceeds',
                        'permission' => 0,
                        'email_limit' => number_format($email_limit),
                    ],200);
                }
            }

            else if($totalEmail+$imported_mails > $email_limit){
                $msg ="Found ". $duplicates. " duplicate";
                return response()->json([
                    'status' => 'success',
                    'duplicate_message' => $msg,
                    'limit_message' => 'Plan email list exceeds',
                    'permission' => 0,
                    'email_limit' => number_format($email_limit),
                ],200);
            }

            $emailList = EmailList::create([
                'user_id' => auth()->id(),
                'list_uid' => Str::uuid(),
                'list_name' => $request->list_name
            ]);


            if (!$emailList)
            {
                return response()->json(['status' => 'error', 'message' => 'Email List Not found'], 403);
            }

            $data = $request->all();

            $emails = $existing_emails = [];

            if ($request->status == 1)
            {
                $existing_emails =  EmailListSubscriber::where('type','User Uploaded')->whereIn('email',array_column($subscribers, 'email'))->pluck('email')->toArray();
            }

            foreach ($subscribers as $datum)
            {
                if (array_key_exists('email',$datum) && $datum['email'])
                {
                    if (!($request->status == 1 && in_array($datum['email'],$existing_emails))){
                        $emails[]              = [
                            'subscriber_uid'    => Str::uuid(),
                            'list_id'           => $emailList->id,
                            'email'             => $datum['email'],
                            'other'             => json_encode($datum),
                            'type'              => 'User Uploaded',
                            'created_at'        => now(),
                            'updated_at'        => now(),
                        ];
                    }
                }
            }

            $chunks = array_chunk($emails,1000);

            foreach ($chunks as $chunk)
            {
                EmailListSubscriber::insert($chunk);
            }

            DB::commit();

            if ($request->status == 1 && $duplicates > 0)
            {
                $msg ="Found ". $duplicates. " duplicate, ". $imported_mails. " were imported";
            }
            else{
                $msg = 'Leads imported successfully';
            }

            return response()->json([
                'status'    => 'success',
                'message'   => $msg,
                'emails'    => SubscriberResource::collection(EmailListSubscriber::where('list_id',$emailList->id)->get()),
                'duplicate' => count($emails) == 0 ? 1 : 0,
                'permission' => 1,
                'email_limit' => number_format($email_limit),
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateSubscriber(Request $request, $user_id, $list_id, $subsrciber_id): \Illuminate\Http\JsonResponse
    {
        $emailList = EmailList::find($list_id);
        if(!$emailList) {
            return response()->json(['status' => 'error', 'message' => 'Email List Not found'], 403);
        }

        $validator = Validator::make($request->all(), ['email' => 'required|email']);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()
            ], 403);
        }

        $data = $request->all();
        unset($data['email']);

        $subscriber = EmailListSubscriber::find($subsrciber_id);
        if(!$subscriber) {
            return response()->json(['status' => 'error', 'message' => 'Email List Not found'], 403);
        }

        $subscriber->update([
            'email' => $request->email,
            'other' => json_encode($data)
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Subscriber updated successfully.',
        ], 200);
    }


    public function destroySubscriber(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            if (is_array($request->subscriber_id)) {
                $ids = $request->subscriber_id;
            } else {
                $ids = [$request->subscriber_id];
            }

            EmailListSubscriber::destroy($ids);

            return response()->json(['status' => 'success', 'message' => 'Subscriber delete successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something Went Wrong'
            ]);
        }
    }

    public function emailList(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $paginate = $request->page_size ? : 12;

            $data = EmailList::withCount('getSubscriber')->whereHas('getSubscriber')->when($request->q,function ($query) use($request){
                $query->where('list_name','LIKE',"%".$request->q."%");
            })->latest()->paginate($paginate);

            $data = [
                'data'          => EmailListResource::collection($data),
                'status'        => 'success',
                'message'       => 'Email list retrieved successfully.',
                'total_rows'    => $data->total()
            ];
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something Went Wrong'
            ],403);
        }
    }
    public function getMultipleSubscribers(Request $request)
    {
        $validator = Validator::make($request->all(), ['ids' => 'required']);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()
            ], 403);
        }

        try {
            $ids = $request->ids;
            if (!is_array($ids)) {
                $ids = [$request->ids];
            }
            $final_list = [];
            $lists = EmailList::with('getSubscriber')->whereIn('id', $ids)->get();
            $emails = [];
            foreach ($lists as $list) {
                foreach ($list->getSubscriber as $subscriber) {
                    $others = json_decode($subscriber->other, true);
                    /*$converted = array_map(function ($key) {
                        return ucwords(str_replace('_', ' ', $key));
                    }, array_keys($others));*/
                    $converted = array_keys($others);

                    $emails[] = array_combine($converted, $others);
                }
                $final_list[] = $emails;
            }

            return response()->json([
                'success' => true,
                'subscribers' => $final_list,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ],403);
        }
    }
}
