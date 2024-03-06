<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\all_plan;
use App\Models\Tenant;
use App\Models\tenant_db_name;
use App\Models\User;
use App\Models\user_order;
use App\Models\user_order_detail;
use App\Models\user_plan;
use Carbon\Carbon;
use Gloudemans\Shoppingcart\Facades\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class UserPaymentController extends Controller
{

    public function __construct(Request $request)
    {
        $host = $request->getHost();
        $host_id = explode('.', trim($host))[0];
        $tenant = Tenant::where('id', $host_id)->first();
        $db_count = tenant_db_name::where('tenant_id', $host_id)->first();

        Config::set('tenancy.database.template_tenant_connection', $db_count->db_con_use);

        DB::purge('tenant');
        Config::set('database.connections.tenant.host', env('DB_HOST'));
        Config::set('database.connections.tenant.username', 'root');
        Config::set('database.connections.tenant.password', '');
        Config::set('database.connections.tenant.database', $tenant->tenancy_db_name);
        DB::reconnect('tenant');
    }

    public function pay_stripe($id, $type)
    {
        $plan = all_plan::where('id', $id)->first();

        $plan_type = $type;
        return view('user.payment.stripe', compact('plan', 'plan_type'));
    }

    public function pay_stripe_submit(Request $request)
    {

        $this->create_single_order($request);
        $this->makePayment($request);

        if ($request->plan_type == 1) {
            $this->makeSubscriptionPlan($request);
            return redirect(route('user.my.plan'));
        } elseif ($request->plan_type == 2) {
            $this->makeCreditPlan($request);
            return redirect(route('user.credit.plan'))->with('success', 'Credit Successful');
        } else {
            $this->makeCreditPlan($request);
            return redirect(route('user.credit.plan'))->with('success', 'Credit Successful');
        }

    }


    private function create_single_order($request)
    {
        $new_order = new user_order();
        $new_order->user_id = Auth::user()->id;
        $new_order->order_id = time() . Auth::user()->id . rand(0000, 9999);
        $new_order->total_amount = number_format($request->plan_amount, 2);
        $new_order->name = Auth::user()->name;
        $new_order->email = Auth::user()->email;
        $new_order->save();


        $order_detais = new user_order_detail();
        $order_detais->user_id = Auth::user()->id;
        $order_detais->order_id = $new_order->id;
        $order_detais->plan_id = $request->plan_id;
        $order_detais->amount = $request->plan_amount;
        $order_detais->plan_type = $request->plan_type;
        $order_detais->save();
        return 'done';

    }


    public function checkout_submit(Request $request)
    {
        $order = $this->create_order($request);
        $order_details = $this->create_order_details($request, $order);
        $payment = $this->makePayment($request);

        return back()->with('success', 'Payment Successful');
    }

    private function create_order($request)
    {
        $new_order = new user_order();
        $new_order->user_id = Auth::user()->id;
        $new_order->order_id = time() . Auth::user()->id . rand(0000, 9999);
        $new_order->total_amount = number_format($request->plan_amount, 2);
        $new_order->name = $request->name;
        $new_order->email = $request->email;
        $new_order->phone = $request->phone;
        $new_order->address = $request->address;
        $new_order->save();

        return $new_order;
    }

    private function create_order_details($request, $order)
    {
        $cards = Cart::content();

        foreach ($cards as $card) {
            $order_detais = new user_order_detail();
            $order_detais->user_id = Auth::user()->id;
            $order_detais->order_id = $order->id;
            $order_detais->plan_id = $card->id;
            $order_detais->amount = $card->price;
            $order_detais->plan_type = $card->options->type;
            $order_detais->save();
        }

        return 'done';
    }

    private function makePayment($request)
    {
        $exp = explode("/", $request->expire);
        $emo = trim($exp[0]);
        $eyr = trim($exp[1]);

        $stripe = new \Stripe\StripeClient(
            env('STRIPE_SECRET_KEY')
        );

        $charge = $stripe->tokens->create([
            'card' => [
                'number' => $request->card,
                'exp_month' => $emo,
                'exp_year' => $eyr,
                'cvc' => $request->cvc,
            ],
        ]);

        $stripe->charges->create([
            'amount' => $request->plan_amount * 100,
            'currency' => 'usd',
            'source' => $charge->id,
            'description' => 'payment plan',
        ]);
    }


    private function makeSubscriptionPlan($request)
    {
        $plan_data = all_plan::where('id', $request->plan_id)->first();
        $check_exists = user_plan::where('user_id', Auth::user()->id)->first();
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

    }

    private function makeCreditPlan($request)
    {
        $credit_plan = all_plan::where('id', $request->plan_id)->first();

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
}
