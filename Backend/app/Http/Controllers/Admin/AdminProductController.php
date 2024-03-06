<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Addon;
use App\Models\all_plan;
use App\Models\product;
use App\Traits\StripeClientTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Stripe\Exception\ApiErrorException;
use Stripe\Plan;
use Stripe\Price;
use Stripe\Stripe;

class AdminProductController extends Controller
{
    use StripeClientTrait;
    public function product_list()
    {
        $all_plans = all_plan::paginate(20);
        return view('admin.product.productList',compact('all_plans'));
    }


    public function product_type_create(Request $request)
    {
        if ($request->plan_type == 1){
            return redirect(route('admin.create.subscription.plan.page'));
        }elseif ($request->plan_type == 2){
            return redirect(route('admin.create.credit.plan.page'));
        }else{
            return back()->with('alert','Please select type');
        }
    }



    public function product_subscription_create()
    {
        return view('admin.product.productSubscription');
    }


    public function product_credit_create()
    {
        return view('admin.product.productCredit');
    }


    public function subscription_product_save(Request $request)
    {
        $request->validate([
            'plan_name'         => 'required',
            'plan_amount'       => 'required',
            'email_account'     => 'required',
            'plan_number_users' => 'required',
            'plan_number_email' => 'required',
            'plan_credit'       => 'required',
            'plan_status'       => 'required',
        ]);
        DB::beginTransaction();
        try {
            Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

            $active = $request->plan_status == 0 ? true : false;

            $price = Price::create([
                'currency' => 'usd',
                'unit_amount' => $request->plan_amount * 100,
                'recurring' => ['interval' => 'month'],
                'product_data' => ['name' => $request->plan_name],
                'active' => $active,
            ]);

            $new_product                    = new all_plan();
            $new_product->stripe_plan_id    = $price->id;
            $new_product->plan_name         = $request->plan_name;
            $new_product->plan_amount       = $request->plan_amount;
            $new_product->email_account     = $request->email_account;
            $new_product->plan_number_users = $request->plan_number_users;
            $new_product->plan_number_email = $request->plan_number_email;
            $new_product->plan_credit       = $request->plan_credit;
            $new_product->plan_status       = $request->plan_status;
            $new_product->plan_type         = 1;
            $new_product->save();
            DB::commit();

            return back()->with('success', 'Product Successfully Created');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', $e->getMessage());
        }
    }

    public function subscription_product_edit($id)
    {
        $plan = all_plan::where('id',$id)->first();
        return view('admin.product.productSubscriptionEdit',compact('plan'));
    }

    public function subscription_product_update(Request $request)
    {
        DB::beginTransaction();
        try {
            $new_product = all_plan::where('id', $request->update_plan)->first();

            if (!$new_product) {
                return back()->with('alert', 'Plan Not Found');
            }

            Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

            $previous_plan_id = $new_product->stripe_plan_id;

            $active = $request->plan_status == 0 ? true : false;
        
            $price = Price::create([
                'currency' => 'usd',
                'unit_amount' => $request->plan_amount * 100,
                'recurring' => ['interval' => 'month'],
                'product_data' => ['name' => $request->plan_name],
                'active' => $active,
            ]);

            $new_product->plan_name         = $request->plan_name;
            $new_product->plan_amount       = $request->plan_amount;
            $new_product->email_account     = $request->email_account;
            $new_product->plan_number_users = $request->plan_number_users;
            $new_product->plan_number_email = $request->plan_number_email;
            $new_product->plan_credit       = $request->plan_credit;
            $new_product->plan_status       = $request->plan_status;
            $new_product->plan_type         = 1;
            $new_product->stripe_plan_id = $price->id;
            $new_product->save();

            if ($previous_plan_id) {
                Price::update(
                    $previous_plan_id,
                    ['active' => false],
                );
            }

            DB::commit();
            return back()->with('success', 'Product Successfully Updated');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Somethign Went Wrong');
        }
    }


    private function create_stripe_product($request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        return Plan::create([
            'amount'    => round($request->plan_amount * 100), // Amount in cents
            'currency'  => 'usd',
            'interval'  => 'month',
            'metadata'  => $request->all(),
            'product'   => [
                'name'  => $request->plan_name
            ]
        ]);

    }

    private function update_stripe_product($request,$product)
    {
        /*Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        return Plan::update($product->stripe_plan_id, [
            'product' => $product->stripe_pro_id,
            'active' => !$request->plan_status, // Optional: Update the plan's nickname
        ]);*/
    }

    public function subscription_product_delete(Request $request)
    {
        $new_product = all_plan::where('id',$request->delete_subs_product)->first();
        if (!$new_product) {
            return back()->with('alert', 'Plan Not Found');
        }
        if ($new_product->stripe_plan_id){
            try {
                Stripe::setApiKey(env('STRIPE_SECRET_KEY'));
                Price::update(
                    $new_product->stripe_plan_id,
                    ['active' => false],
                );
            } catch (ApiErrorException $e) {
                return back()->with('error', $e->getMessage());
            }
        }
        $new_product->delete();
        return back()->with('success','Product Successfully Deleted');
    }

    public function credit_product_save(Request $request)
    {
        $request->validate([
            'plan_name'         => 'required',
            'plan_amount'       => 'required',
            'plan_credit'       => 'required',
            'plan_status'       => 'required',
        ]);  
        DB::beginTransaction();
        try {
            Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

            $active = $request->plan_status == 0 ? true : false;

            $price = Price::create([
                'currency' => 'usd',
                'unit_amount' => $request->plan_amount * 100,
                'product_data' => ['name' => $request->plan_name],
                'active' => $active,
            ]);

            $plan = new all_plan();
            $plan->plan_name = $request->plan_name;
            $plan->plan_amount = $request->plan_amount;
            $plan->plan_credit = $request->plan_credit;
            $plan->plan_status = $request->plan_status;
            $plan->plan_type = 2;
            $plan->stripe_plan_id = $price->id;
            $plan->save();

            DB::commit();
            return redirect(route('admin.product.management'))->with('success', 'Credit Plan Successfully Created');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Somethign Went Wrong');
        }
    }

    public function credit_product_edit($id)
    {
        $plan = all_plan::where('id',$id)->first();
        return view('admin.product.productCreditEdit',compact('plan'));
    }

    public function credit_product_update(Request $request)
    {
        DB::beginTransaction();
        try {
            $plan = all_plan::where('id', $request->plan_edit_id)->first();

            if (!$plan) {
                return back()->with('alert', 'Plan Not Found');
            }

            Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

            $previous_plan_id = $plan->stripe_plan_id;

            $active = $request->plan_status == 0 ? true : false;
        
            $price = Price::create([
                'currency' => 'usd',
                'unit_amount' => $request->plan_amount * 100,
                'product_data' => ['name' => $request->plan_name],
                'active' => $active,
            ]);

            $plan->plan_name = $request->plan_name;
            $plan->plan_amount = $request->plan_amount;
            $plan->plan_credit = $request->plan_credit;
            $plan->plan_status = $request->plan_status;
            $plan->plan_type = 2;
            $plan->stripe_plan_id = $price->id;
            $plan->save();

            if ($previous_plan_id) {
                Price::update(
                    $previous_plan_id,
                    ['active' => false],
                );
            }

            DB::commit();
            return redirect(route('admin.product.management'))->with('success', 'Credit Plan Successfully Updated');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Somethign Went Wrong');
        }
    }

    public function credit_product_delete(Request $request)
    {
        $plan = all_plan::where('id', $request->delete_cred_product)->first();
        if (!$plan) {
            return back()->with('alert', 'Plan Not Found');
        }
        if ($plan->stripe_plan_id){
            try {
                Stripe::setApiKey(env('STRIPE_SECRET_KEY'));
                Price::update(
                    $plan->stripe_plan_id,
                    ['active' => false],
                );
            } catch (ApiErrorException $e) {
                return back()->with('error', $e->getMessage());
            }
        }
        $plan->delete();
        return back()->with('success', 'Credit Plan Successfully Deleted');
    }

    public function plans()
    {
        //plan_NxXJkpVciN8XzV
        $data = [
            'amount'    => round(100 * 100), // Amount in cents
            'product'  => 'prod_NxXJGGoLgO2gqT',
        ];
        dd($this->makeRequest('POST','https://api.stripe.com/v1/plans/plan_NxXJkpVciN8XzV',$data));
    }

    public function createAddons()
    {
        try {
            $addon = Addon::first();

            if ($addon)
            {
                dd('already added');
            }

            Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

            $credits = [50000, 75000, 100000, 125000, 150000, 175000, 200000, 225000, 250000, 275000, 300000, 350000, 400000, 450000, 500000];
            $emails = [300000, 450000, 600000, 750000, 900000, 1050000, 1200000, 1350000, 1500000, 1650000, 1800000, 2100000, 2400000, 2700000, 3000000];
            $prices = [748, 1042, 1319, 1588, 1806, 2008, 2260, 2512, 2722, 2932, 3100, 3259, 3352, 3436, 3604];
            foreach ($credits as $key => $credit) {
                $product        = Plan::create([
                    'amount'    => round($prices[$key] * 100), // Amount in cents
                    'currency'  => 'usd',
                    'interval'  => 'year',
                    'metadata'  => [],
                    'product'   => [
                        'name'  => 'Growtoro Yearly Addons ' . $key+1
                    ]
                ]);

                Addon::create([
                    'credits'           => $credit,
                    'emails'            => $emails[$key],
                    'price'             => $prices[$key],
                    'stripe_pro_id'     => $product->product,
                    'stripe_plan_id'    => $product->id,
                    'interval_type'     => 'yearly'
                ]);
            }

            $prices = [89, 124, 157, 189, 215, 239, 269, 299, 324, 349, 369, 388, 399, 409, 429];
            foreach ($credits as $key => $credit) {
                $product        = Plan::create([
                    'amount'    => round($prices[$key] * 100), // Amount in cents
                    'currency'  => 'usd',
                    'interval'  => 'month',
                    'metadata'  => [],
                    'product'   => [
                        'name'  => 'Growtoro Monthly Addons ' . $key+1
                    ]
                ]);

                Addon::create([
                    'credits'           => $credit,
                    'emails'            => $emails[$key],
                    'price'             => $prices[$key],
                    'stripe_pro_id'     => $product->product,
                    'stripe_plan_id'    => $product->id,
                    'interval_type'     => 'monthly'
                ]);
            }
            dd('plans created');
        } catch (\Exception $e) {
            dd($e);
        }
    }
}
