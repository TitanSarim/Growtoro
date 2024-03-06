<?php

namespace App\Repositories;

use App\Http\Resources\SubscriptionResource;
use App\Models\all_plan;
use App\Models\User;
use App\Models\user_plan;
use App\Repositories\Interfaces\APIUserPlanInterface;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class APIUserPlanRepository implements APIUserPlanInterface
{
    public function get_subscription_plan($request, $user_id)
    {
        $plans = all_plan::active()
            ->subscriptionPlan()
            ->with('planFacilityData')
            ->orderBy('id', 'desc')
            ->paginate(20);

        return response()->json([
            'status' => 'success',
            'message' => 'get subscription plan',
            'plans' => $plans,
        ]);
    }

    public function get_product_plan($request, $user_id)
    {
        $product_plan = all_plan::where('plan_type',1)
            ->where('plan_status',0)
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'get product plan',
            'data' => SubscriptionResource::collection($product_plan),
        ]);
    }


    public function get_credit_plan($request, $user_id)
    {
        $plans = all_plan::active()->selectRaw('id,plan_name,plan_amount,plan_credit')->creditPlan()->orderBy('plan_amount')->paginate(20);

        return response()->json([
            'status' => 'success',
            'error' => 'get credit plan',
            'plans' => $plans,
        ]);
    }


    public function get_my_plan($request, $user_id)
    {
        $plan = user_plan::where('user_id', $user_id)->with('plan')->first();

        return response()->json([
            'status' => 'success',
            'message' => 'get my plan',
            'plans' => $plan,
        ]);
    }


    public function user_plan_purchase($request, $user_id)
    {
        $get_plan = $this->getPlanById($request->plan_id);

        if ($get_plan->plan_type == 1) {
            $subplan = $this->make_user_subscription_plan($request, $user_id);
            return $subplan;
        } elseif ($get_plan->plan_type == 2) {
            $cre_plan = $this->make_user_credit_plan($request, $user_id);
            return $cre_plan;
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'something goes wrong',
            ]);
        }
    }


    public function make_user_subscription_plan($request, $user_id)
    {
        $plan_data = $this->getPlanById($request->plan_id);
        $check_exists = $this->checkUserPlan();
        if ($check_exists) {
            $check_exists->plan_id = $plan_data->id;
            $check_exists->status = 0;
            $check_exists->purchase_date = Carbon::now();
            $check_exists->plan_type = $plan_data->plan_type;
            $check_exists->save();
        } else {
            $new_user_plan = new user_plan();
            $new_user_plan->user_id = Auth::user()->id;
            $new_user_plan->plan_id = $plan_data->id;
            $new_user_plan->status = 0;
            $new_user_plan->purchase_date = Carbon::now();
            $new_user_plan->plan_type = $plan_data->plan_type;
            $new_user_plan->save();
        }


        return response()->json([
            'status' => 'success',
            'message' => 'User subscription plan successfully purchase',
            'plans' => $this->checkUserPlan(),
        ]);


    }


    public function make_user_credit_plan($request, $user_id)
    {
        $credit_plan = $this->getPlanById($request->plan_id);

        $user_credit_plan = new user_plan();
        $user_credit_plan->user_id = Auth::user()->id;
        $user_credit_plan->plan_id = $credit_plan->id;
        $user_credit_plan->status = 0;
        $user_credit_plan->purchase_date = Carbon::now();
        $user_credit_plan->plan_type = $credit_plan->plan_type;
        $user_credit_plan->save();


        $check_credit = Auth::user()->credit == null ? 0 : Auth::user()->credit;
        $user = User::where('id', Auth::user()->id)->first();
        $user->credit = $check_credit + $credit_plan->plan_credit;
        $user->save();
    }

    protected function checkUserPlan()
    {
        $user_plan = user_plan::where('user_id', Auth::user()->id)->first();
        return $user_plan;
    }


    protected function getPlanById($id)
    {
        $plan_data = all_plan::where('id', $id)->first();
        return $plan_data;
    }
}
