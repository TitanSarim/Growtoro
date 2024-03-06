<?php

namespace App\Http\Controllers\API\Public;

use App\Http\Controllers\Controller;
use App\Models\Addon;
use App\Models\all_plan;
use App\Models\Emails\DripCampaign;
use App\Models\Emails\DripClick;
use App\Models\Emails\DripOpen;
use App\Models\Emails\DripSqClick;
use App\Models\Emails\DripSqOpen;
use App\Models\Emails\DripSqUrl;
use App\Models\Emails\DripUrl;
use App\Models\Emails\EmailListSubscriber;
use App\Models\Instruction;
use App\Models\StripeSession;
use App\Models\tenant_db_name;
use App\Models\User;
use App\Models\user_order;
use App\Models\user_plan;
use App\Models\UserAddon;
use App\Models\UserCredit;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Stripe\BillingPortal\Session as BillingSession;
use Stripe\Checkout\Session;
use Stripe\Exception\ApiErrorException;
use Stripe\Stripe;
use Stripe\Subscription;
use Stripe\Customer;

class PublicController extends Controller
{
    public function get_public_order_list(Request $request)
    {
        $user_orders = user_order::where('user_id',$request->user_id)->paginate(20);

        return response()->json([
            'status' => 'success',
            'message' => 'get order list',
            'orders'=>$user_orders
        ]);
    }

    public function dripOpenCount($t_id, $cp_id, $sb_id,$sequence_id)
    {
        $campaign = $this->getDripCamapignId($cp_id);
        $subscriber = $this->getSubscriberId($sb_id);
        if(!$campaign && !$subscriber) {
            return response()->json(['status' => 'error','message' => 'Campaign or user not found']);
        }
        $sb = DripOpen::where([
            ['drip_id', '=', $campaign],
            ['sequence_id', '=', $sequence_id],
            ['subscriber_id', '=', $subscriber]
        ])->first();
        if ($sb) {
            $sb->update(['count' => $sb->count + 1]);
            return response()->json(['status' => 'success','message' => 'Success']);
        } else {
            DripOpen::create([
                'drip_id'       => $campaign,
                'subscriber_id' => $subscriber,
                'sequence_id'   => $sequence_id,
                'count'         => 1
            ]);
            return response()->json(['status' => 'success','message' => 'Success']);
        }
    }

    public function dripSqOpenCount($t_id, $cp_id, $sb_id)
    {
        $campaign = $this->getDripCamapignId($cp_id);
        $subscriber = $this->getSubscriberId($sb_id);
        if(!$campaign && !$subscriber) {
            return response()->json(['status' => 'error','message' => 'Campaign or user not found']);
        }
        $sb = DripSqOpen::where([
            ['sq_id', '=', $campaign],
            ['sequence_id', '=', $sequence_id],
            ['subscriber_id', '=', $subscriber]
        ])->first();
        if ($sb) {
            $sb->update(['count' => $sb->count + 1]);
            return response()->json(['status' => 'success','message' => 'Success']);
        } else {
            DripSqOpen::create([
                'sq_id' => $campaign,
                'subscriber_id' => $subscriber,
                'count' => 1
            ]);
            return response()->json(['status' => 'success','message' => 'Success']);
        }
    }

    public function dripClickCount($t_id, $cp_id, $sb_id, $link,$sequence_id)
    {
        $campaign = $this->getDripCamapignId($cp_id);
        $subscriber = $this->getSubscriberId($sb_id);
        $destinationLink = DripUrl::where('hash', $link)->first();
        if(!$destinationLink) {
            return response()->json(['status' => 'error','message' => 'Url not found']);
        }
        if(!$campaign && !$subscriber) {
            return response()->json(['status' => 'error','message' => 'Campaign or user not found']);
        }
        $sb = DripClick::where([
            ['drip_id', '=', $campaign],
            ['sequence_id', '=', $sequence_id],
            ['subscriber_id', '=', $subscriber]
        ])->first();
        if ($sb) {
            $sb->update(['count' => $sb->count + 1]);
        } else {
            DripClick::create([
                'drip_id'       => $campaign,
                'subscriber_id' => $subscriber,
                'sequence_id'   => $sequence_id,
                'count'         => 1
            ]);
        }
        return redirect()->away($destinationLink->destination);
    }

    public function dripSqClickCount($t_id, $cp_id, $sb_id, $link)
    {
        $campaign = $this->getDripCamapignId($cp_id);
        $subscriber = $this->getSubscriberId($sb_id);
        $destinationLink = DripSqUrl::where('hash', $link)->first();
        if(!$destinationLink) {
            return response()->json(['status' => 'error','message' => 'Url not found']);
        }
        if(!$campaign && !$subscriber) {
            return response()->json(['status' => 'error','message' => 'Campaign or user not found']);
        }
        $sb = DripSqClick::where([
            ['sq_id', '=', $campaign],
            ['subscriber_id', '=', $subscriber]
        ])->first();
        if ($sb) {
            $sb->update(['count' => $sb->count + 1]);
        } else {
            DripSqClick::create(['sq_id' => $campaign, 'subscriber_id' => $subscriber, 'count' => 1]);
        }
        return redirect()->away($destinationLink->destination);

    }

    public function dripListUnsubscribe($t_id, $cp_id, $sb_id)
    {
        $this->getDripCamapignId($cp_id);
        $sb = EmailListSubscriber::where('subscriber_uid', $sb_id)->first();
        if ($sb) {
            $sb->update(['status' => 0]);
            return response()->json(['status' => 'success','message' => 'Success']);
        }
        return response()->json(['status' => 'error','message' => 'User not found']);
    }

    public function dripSqListUnsubscribe($t_id, $cp_id, $sb_id)
    {
        $this->getDripCamapignId($cp_id);
        $sb = EmailListSubscriber::where('subscriber_uid', $sb_id)->first();;
        if ($sb) {
            $sb->update(['status' => 0]);
            return response()->json(['status' => 'success','message' => 'Success'],200);
        }
        return response()->json(['status' => 'error','message' => 'User not found']);
    }

    private function getDripCamapignId($uid)
    {
        $campaign = DripCampaign::where('dirp_uid', $uid)->first();
        return (!$campaign)? false: $campaign->id;
    }

    private function getSubscriberId($uid)
    {
        $subscriber = EmailListSubscriber::where('subscriber_uid', $uid)->first();
        return (!$subscriber)? false: $subscriber->id;
    }

    protected function configureDB($tenant_id)
    {
        $tenant = tenant_db_name::where('tenant_id', $tenant_id)->first();

        Config::set('tenancy.database.template_tenant_connection', $tenant->db_con_use);
        DB::purge('tenant');
        Config::set('database.connections.tenant.host', env('DB_HOST'));
        Config::set('database.connections.tenant.username', env('DB_USERNAME'));
        Config::set('database.connections.tenant.password', env('DB_PASSWORD'));
        Config::set('database.connections.tenant.database', $tenant->tenant_db);
        Config::set('database.default', 'tenant');
        DB::reconnect('tenant');

        return $tenant;
    }

    public function createSubscription($tenant_id,$plan_id): \Illuminate\Http\JsonResponse|\Illuminate\Routing\Redirector|\Illuminate\Http\RedirectResponse|\Illuminate\Contracts\Foundation\Application|null
    {
        try {
            $tenant = $this->configureDB($tenant_id);
            Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

            $user = User::where('email', $tenant->tenant_email)->first();
            $userDetails = $user->toArray();

            $stripe_session = StripeSession::create([
                'tenant_id' => $tenant_id,
                'plan_id'   => $plan_id
            ]);

            $checkCustomer = $this->checkStripeCustomerExists($tenant->stripe_customer_id);


            if(isset($checkCustomer->error) && isset($checkCustomer->error->code) == 'resource_missing'){

                $customer = Customer::create([
                    'name' => $userDetails['name'], // Name of the customer
                    'email' => $userDetails['email'], // Email of the customer
                    'metadata' => $userDetails,
                ]);

                $tenant->forceFill(['stripe_customer_id' => $customer->id])->save();
                $user->update(['strip_cus_id'=>$customer->id]);
            }

            $url = URL::temporarySignedRoute('checkout.success',now()->addMinutes(5), ['session_id' => $stripe_session->id,'tenant_id' => $tenant_id,'plan_id' => $plan_id]);
            $app_url = \getUrl();

            $session = Session::create([
                'customer' => $tenant->stripe_customer_id, // ID of the Stripe customer
                'payment_method_types' => ['card'], // Payment method types accepted
                'line_items' => [
                    [
                        'price' => $plan_id, // ID of the Stripe price
                        'quantity' => 1,
                    ],
                ],
                'mode' => 'subscription', // Subscription mode
                'success_url' => $url,
                'cancel_url' => "$app_url/profile?tab=0",
            ]);

            $stripe_session->update(['session_id' => $session->id]);

            return redirect($session->url);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ],403);
        }
    }

    protected function checkStripeCustomerExists($customer_id){

        $curl = curl_init();

            curl_setopt_array($curl, array(
              CURLOPT_URL => 'https://api.stripe.com/v1/customers/'.$customer_id,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => '',
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 0,
              CURLOPT_FOLLOWLOCATION => true,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => 'GET',
               CURLOPT_HTTPHEADER => array(
                'Authorization: Bearer '.env('STRIPE_SECRET_KEY')
              ),
            ));

            $response = curl_exec($curl);

            curl_close($curl);
            return  json_decode($response);

    }

    public function stripeClientPortal($tenant_id): \Illuminate\Routing\Redirector|\Illuminate\Http\RedirectResponse|\Illuminate\Contracts\Foundation\Application|null
    {
        $tenant = tenant_db_name::where('tenant_id',$tenant_id)->first();

        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));
        $app_url = \getUrl();

        $session = BillingSession::create([
            'customer'      => $tenant->stripe_customer_id, //'cus_NtVXZCvC33uJCi', // ID of the Stripe customer
            'return_url'    => "$app_url/profile?tab=0",
        ]);

        return redirect($session->url);
    }

    public function success(Request $request): \Illuminate\Http\JsonResponse|\Illuminate\Routing\Redirector|\Illuminate\Http\RedirectResponse|\Illuminate\Contracts\Foundation\Application|null
    {
        DB::beginTransaction();
        try {
            $plan = all_plan::where('stripe_plan_id', $request->plan_id)->first();
            $tenant = $this->configureDB($request->tenant_id);

            $session = StripeSession::find($request->session_id);
            if (!$session) {
                return response()->json([
                    'error' => 'Something Went Wrong'
                ]);
            }
            Stripe::setApiKey(env('STRIPE_SECRET_KEY'));
            $stripe_session = Session::retrieve($session->session_id);
            if (!$stripe_session) {
                return response()->json([
                    'error' => 'Something Went Wrong'
                ]);
            }
            $subscriptionId = $stripe_session->subscription;
            $user = User::where('email', $tenant->tenant_email)->first();
            $current_plan = user_plan::where('user_id', $user->id)->where('status', 1)->latest()->first();
            if ($current_plan) {
                $subscription = Subscription::retrieve($subscriptionId);
                $subscription->cancel();

                $current_plan->update(['status' => 0]);
            }
            $data                           = [
                'user_id'                   => $user->id,
                'plan_id'                   => $plan->id,
                'exp_date'                  => Carbon::now()->addMonths(1),
                'purchase_date'             => Carbon::now(),
                'plan_type'                 => $plan->plan_type,
                'status'                    => 1,
                'plan_amount'               => $plan->plan_amount,
                'email_account'             => $plan->email_account,
                'plan_number_users'         => $plan->plan_number_users,
                'plan_number_email'         => $plan->plan_number_email,
                'plan_credit'               => $plan->plan_credit,
                'custom_credit'             => $plan->custom_credit ?? 0,
                'stripe_subscription_id'    => $subscriptionId,
            ];
            $plan = user_plan::create($data);

            StripeSession::where('tenant_id',$request->tenant_id)->delete();

            $tenant = tenant_db_name::where('tenant_id',$request->tenant_id)->first();
            $curl = curl_init();

            $payload = array(
                "event_name"        => "$user->name subscribed to $plan->plan_name",
                "created_at"        => now()->timestamp,
                "user_id"           => (string)$request->tenant_id,
                "id"                => Str::random(32),
                "email"             => $tenant->tenant_email,
                "metadata"          => array(
                    "invite_code"   => $request->tenant_id
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

            curl_close($curl);

            $app_url = \getUrl();
            DB::commit();
            return redirect("$app_url/profile?tab=0");
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Something Went Wrong'
            ],403);
        }
    }

    public function payAsYouGo(Request $request): \Illuminate\Routing\Redirector|\Illuminate\Http\RedirectResponse|\Illuminate\Contracts\Foundation\Application|null
    {
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        $url        = URL::temporarySignedRoute('pay-as-you-go.success',now()->addMinutes(5), ['tenant_id' => $request->tenant_id,'credit_id' => $request->credit_id]);
        $plan       = all_plan::find($request->credit_id);
        $app_url    = \getUrl();

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [
                [
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => $plan->plan_name
                        ],
                        'unit_amount' => round($plan->plan_amount * 100),
                    ],

                    'quantity' => 1,
                ]
            ],
            'phone_number_collection' => [
                'enabled' => true,
            ],

            'mode' => 'payment',
            'success_url' => $url,
            'cancel_url' => "$app_url/profile?tab=0",
        ]);

        return redirect($session->url);
    }

    public function payAsYouGoSuccess(Request $request): \Illuminate\Http\JsonResponse|\Illuminate\Routing\Redirector|\Illuminate\Http\RedirectResponse|\Illuminate\Contracts\Foundation\Application|null
    {
        try {
            $credit_plan = all_plan::find($request->credit_id);
            $tenant = $this->configureDB($request->tenant_id);
            $user = User::where('email', $tenant->tenant_email)->first();
            $credit = UserCredit::first();
            if ($credit)
            {
                $credit->update([
                    'credit_id' => $credit_plan->id,
                    'amount' => $credit_plan->plan_amount + $credit->amount,
                    'credits' => $credit_plan->plan_credit + $credit->credits,
                    'user_id' => $user->id,
                    'status' => 1,
                    'date' => now(),
                ]);
            }
            else{
                UserCredit::create([
                    'credit_id' => $credit_plan->id,
                    'amount' => $credit_plan->plan_amount,
                    'credits' => $credit_plan->plan_credit,
                    'user_id' => $user->id,
                    'status' => 1,
                    'date' => now(),
                ]);
            }
            $app_url = \getUrl();

            return redirect("$app_url/profile?tab=0");
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something Went Wrong'
            ]);
        }
    }

    public function createAddonSubscription($tenant_id,$plan_id): \Illuminate\Http\JsonResponse|\Illuminate\Routing\Redirector|\Illuminate\Http\RedirectResponse|\Illuminate\Contracts\Foundation\Application|null
    {
        try {
            $tenant = $this->configureDB($tenant_id);
            Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

            $stripe_session = StripeSession::create([
                'tenant_id' => $tenant_id,
                'plan_id'   => $plan_id
            ]);

            $url = URL::temporarySignedRoute('checkout.addon.success',now()->addMinutes(5), ['session_id' => $stripe_session->id,'tenant_id' => $tenant_id,'plan_id' => $plan_id]);
            $app_url = \getUrl();

            $session = Session::create([
                'customer' => $tenant->stripe_customer_id, // ID of the Stripe customer
                'payment_method_types' => ['card'], // Payment method types accepted
                'line_items' => [
                    [
                        'price' => $plan_id, // ID of the Stripe price
                        'quantity' => 1,
                    ],
                ],
                'mode' => 'subscription', // Subscription mode
                'success_url' => $url,
                'cancel_url' => "$app_url/profile?tab=0",
            ]);

            $stripe_session->update(['session_id' => $session->id]);

            return redirect($session->url);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something Went Wrong'
            ]);
        }
    }

    public function addonSuccess(Request $request): \Illuminate\Http\JsonResponse|\Illuminate\Routing\Redirector|\Illuminate\Http\RedirectResponse|\Illuminate\Contracts\Foundation\Application|null
    {
        DB::beginTransaction();
        try {
            $addon = Addon::where('stripe_plan_id', $request->plan_id)->first();
            $type = $addon->interval_type;
            $tenant = $this->configureDB($request->tenant_id);

            $session = StripeSession::find($request->session_id);
            if (!$session) {
                return response()->json([
                    'error' => 'Something Went Wrong'
                ]);
            }
            Stripe::setApiKey(env('STRIPE_SECRET_KEY'));
            $stripe_session = Session::retrieve($session->session_id);
            if (!$stripe_session) {
                return response()->json([
                    'error' => 'Something Went Wrong'
                ]);
            }
            $subscriptionId = $stripe_session->subscription;
            $user = User::where('email', $tenant->tenant_email)->first();
            $current_plan = UserAddon::where('user_id', $user->id)->where('status', 1)->latest()->first();
            if ($current_plan) {
                $subscription = Subscription::retrieve($current_plan->stripe_subscription_id);
                if ($subscription)
                {
                    $subscription->cancel();
                }

                $current_plan->update(['status' => 0]);
            }
            $data                           = [
                'user_id'                   => $user->id,
                'addon_id'                  => $addon->id,
                'purchase_date'             => Carbon::now(),
                'exp_date'                  => $type == 'monthly' ? Carbon::now()->addMonths(1) : Carbon::now()->addYears(1),
                'credits'                   => $addon->credits,
                'emails'                    => $addon->emails,
                'price'                     => $addon->price,
                'stripe_subscription_id'    => $subscriptionId,
                'status'                    => 1,
            ];

            UserAddon::create($data);

            StripeSession::where('tenant_id',$request->tenant_id)->delete();
            $app_url = \getUrl();

            DB::commit();
            return redirect("$app_url/profile?tab=0");
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Something Went Wrong'
            ]);
        }
    }


}
