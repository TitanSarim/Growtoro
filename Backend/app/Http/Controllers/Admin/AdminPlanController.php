<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\all_plan;
use App\Models\plan_facility;
use App\Models\Tenant;
use App\Models\User;
use App\Models\user_plan;
use App\Repositories\AdminPlanRepository;
use App\Repositories\AdminUserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Stripe\Stripe;
use Stripe\Price;

class AdminPlanController extends Controller
{

    private $AdminPlanRepo;
    private $AdminUserRepo;

    public function __construct(AdminPlanRepository $AdminPlanRepository, AdminUserRepository $AdminUserRepository)
    {
        $this->AdminPlanRepo = $AdminPlanRepository;
        $this->AdminUserRepo = $AdminUserRepository;
        $this->AdminUserRepo->init_user_db();
    }

    public function plan_list()
    {
        $plans = $this->AdminPlanRepo->get_all_plan();
        return view('admin.subscription.planList', compact('plans'));
    }

    public function plan_save(Request $request)
    {   
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        $price = Price::create([
            'currency' => 'usd',
            'unit_amount' => $request->plan_amount * 100,
            'recurring' => ['interval' => 'month'],
            'product_data' => ['name' => $request->plan_name],
        ]);

        $plan = new all_plan();
        $plan->plan_name = $request->plan_name;
        $plan->plan_amount = $request->plan_amount;
        $plan->plan_credit = 0;
        $plan->plan_description = $request->plan_description;
        $plan->plan_status = $request->plan_status;
        $plan->plan_type = 1;
        $plan->stripe_plan_id = $price->id;
        $plan->save();

        return back()->with('success', 'Plan Successfully Created');
    }

    public function plan_update(Request $request)
    {
        $plan = all_plan::where('id', $request->plan_edit_id)->first();
        if (!$plan) {
            return back()->with('alert', 'Plan Not Found');
        }

        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        $previous_plan_id = $plan->stripe_plan_id;
    
        $price = Price::create([
            'currency' => 'usd',
            'unit_amount' => $request->plan_amount * 100,
            'recurring' => ['interval' => 'month'],
            'product_data' => ['name' => $request->plan_name],
        ]);

        $plan->plan_name = $request->plan_name;
        $plan->plan_amount = $request->plan_amount;
        $plan->plan_credit = 0;
        $plan->plan_description = $request->plan_description;
        $plan->plan_status = $request->plan_status;
        $plan->plan_type = 1;
        $plan->stripe_plan_id = $price->id;
        $plan->save();

        if ($previous_plan_id) {
            Price::update(
                $previous_plan_id,
                ['active' => false],
            );
        }

        return back()->with('success', 'Plan Successfully Updated');
    }

    public function plan_delete(Request $request)
    {
        $plan = all_plan::where('id', $request->plan_delete_id)->first();
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        if ($plan->stripe_plan_id) {
            Price::update(
                $plan->stripe_plan_id,
                ['active' => false],
            );
        }

        $plan->delete();
        return back()->with('success', 'Plan Successfully Deleted');
    }


    public function user_plans()
    {
        $user_plans = $this->AdminUserRepo->get_user_plan();
        return view('admin.subscription.userPlan', compact('user_plans'));
    }

    public function user_plans_update(Request $request)
    {
        $user_plan = user_plan::where('id', $request->user_plan_id)->first();
        $user_plan->status = $request->plan_status;
        $user_plan->save();
        return back()->with('success', 'Plan Successfully Updated');
    }

    public function user_custom_order()
    {
        $plans = all_plan::subscriptionPlan()->get();
        $users = $this->AdminUserRepo->get_all_users();
        return view('admin.subscription.customOrder', compact('plans', 'users'));
    }


    public function user_custom_order_save(Request $request)
    {
        $check_user_plan = user_plan::where('user_id', $request->user_id)->first();

        $plan = all_plan::where('id', $request->plan_id)->first();

        if ($check_user_plan) {
            $check_user_plan->plan_id = $plan->id;
            $check_user_plan->status = $request->status;
            $check_user_plan->purchase_date = Carbon::now();
            $check_user_plan->plan_type = $plan->plan_type;
            $check_user_plan->save();
        } else {
            $new_user_plan = new user_plan();
            $new_user_plan->user_id = $request->user_id;
            $new_user_plan->plan_id = $plan->id;
            $new_user_plan->status = $request->status;
            $new_user_plan->purchase_date = Carbon::now();
            $new_user_plan->plan_type = $plan->plan_type;
            $new_user_plan->save();
        }


        return back()->with('success', 'Plan Successfully Assigned');
    }


    public function credit_plan()
    {
        $all_plans = $this->AdminPlanRepo->get_credit_plan();
        return view('admin.credit.creditPlan', compact('all_plans'));
    }

    public function credit_plan_save(Request $request)
    {
        $plan = new all_plan();
        $plan->plan_name = $request->plan_name;
        $plan->plan_amount = $request->plan_amount;
        $plan->plan_credit = $request->plan_credit;
        $plan->plan_status = $request->plan_status;
        $plan->plan_type = 2;
        $plan->save();

        return back()->with('success', 'Credit Plan Successfully Created');
    }

    public function credit_plan_update(Request $request)
    {
        $plan = all_plan::where('id', $request->plan_edit_id)->first();
        $plan->plan_name = $request->plan_name;
        $plan->plan_amount = $request->plan_amount;
        $plan->plan_credit = $request->plan_credit;
        $plan->plan_status = $request->plan_status;
        $plan->plan_type = 2;
        $plan->save();

        return back()->with('success', 'Credit Plan Successfully Updated');
    }

    public function credit_plan_delete(Request $request)
    {
        $plan = all_plan::where('id', $request->plan_delete_id)->first();
        $plan->delete();
        return back()->with('success', 'Credit Plan Successfully Deleted');
    }


    public function credit_user_list()
    {
        $user_credit = $this->AdminUserRepo->get_user_credit_plan();
        return view('admin.credit.creditUserList', compact('user_credit'));
    }


    public function plan_facility($id)
    {
        $check_count = plan_facility::where('plan_id',$id)->count();
        if ($check_count <= 0 ){
            for ($i=1;$i<= 10;$i++){
                $new_plan_fac = new plan_facility();
                $new_plan_fac->plan_id = $id;
                $new_plan_fac->save();
            }
        }

        $plan_fac_list = plan_facility::where('plan_id',$id)->get();

        return view('admin.subscription.planFacility',compact('plan_fac_list'));
    }


    public function plan_facility_save(Request $request)
    {
        $data = $request->all();

        if (isset($data['description'])){
            for ($i = 0; $i < count($request->description);$i++){
                $plan_fac_update = plan_facility::where('id',$data['plan_edit_id'][$i])->first();
                $plan_fac_update->description = $data['description'][$i];
                $plan_fac_update->save();

            }
        }

        return back();
    }
}
