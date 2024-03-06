<?php

namespace App\Http\Controllers\API\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\PlanResource;
use App\Models\all_plan;
use App\Models\Emails\EmailListSubscriber;
use App\Models\user_plan;
use App\Models\UserCredit;
use App\Repositories\APIUserPlanRepository;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Stripe\Stripe;
use Stripe\Subscription;

class UserPlanController extends Controller
{


    protected $user_id;
    private $APIUsrPlnRepository;

    public function __construct(APIUserPlanRepository $APIUserPlanRepository)
    {
        $this->APIUsrPlnRepository = $APIUserPlanRepository;
        $this->middleware(function ($request, $next) {
            $this->user_id = Auth::id();
            return $next($request);
        });
    }


    public function get_subscription_plan(Request $request)
    {
        $data = $this->APIUsrPlnRepository->get_subscription_plan($request, $this->user_id);
        return $data;

    }

    public function get_product_plan(Request $request)
    {
        $data = $this->APIUsrPlnRepository->get_product_plan($request, $this->user_id);
        return $data;
    }

    public function get_credit_plan(Request $request)
    {
        $data = $this->APIUsrPlnRepository->get_credit_plan($request, $this->user_id);
        return $data;
    }

    public function activePlan(): \Illuminate\Http\JsonResponse
    {
        try {
            $subscription = user_plan::with('plan')->where('user_id', 1)->where('status', 1)->first();
            if (!$subscription) {
                return response()->json([
                    'error' => 'No Subscription Found'
                ], 403);
            }

            $data = [
                'data' => [
                    'id'                => $subscription->id,
                    'plan_id'           => $subscription->plan_id,
                    'renew_date'        => Carbon::parse($subscription->exp_date)->format('F d, Y'),
                    'plan_name'         => $subscription->plan->plan_name,
                    'email_account'     => $subscription->email_account,
                    'plan_credit'       => $subscription->plan_credit,
                    'plan_number_email' => $subscription->plan_number_email,
                    'plan_number_users' => $subscription->plan_number_users,
                ],
                'success' => 'Plan Retrieved Successfully'
            ];
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something Went Wrong'
            ],403);
        }
    }

    public function get_my_plan(): \Illuminate\Http\JsonResponse
    {
        try {
            $rows = [];
            $plans = user_plan::with('plan')->where('user_id', auth()->id())->get();

            foreach ($plans as $plan)
            {
                if ($plan->plan)
                {
                    $rows[] = [
                        'date'          => Carbon::parse($plan->purchase_date)->format('F d, Y'),
                        'type'          => $plan->plan->plan_name,
                    ];
                }
            }
            return response()->json([
                'status'        => 'success',
                'message'       => 'get my plan',
                'order_history' => $rows,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e
            ],403);
        }
    }

    public function cancelSubscription()
    {
        try {
            $current_plan = user_plan::where('user_id', auth()->id())->where('status', 1)->latest()->first();
            Stripe::setApiKey(env('STRIPE_SECRET_KEY'));
            if ($current_plan) {
                $subscription = Subscription::retrieve($current_plan->stripe_subscription_id);
                if ($subscription)
                {
                    $subscription->cancel();
                }

                $current_plan->update(['status' => 0]);
            }
            return response()->json([
                'message' => 'Subscription Canceled Successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something Went Wrong'
            ],403);
        }
    }

    public function getCredits(): \Illuminate\Http\JsonResponse
    {
        try {
            $subscription               = user_plan::where('user_id', auth()->id())->where('status', 1)->first();
            if ($subscription) {
                $next_subscription_time     = $subscription->exp_date ? Carbon::parse($subscription->exp_date) : Carbon::parse($subscription->purchase_date)->addMonths(1);
                if ($next_subscription_time < now())
                {
                    $subscription->update(['status' => 0]);
                    $plan = all_plan::where('plan_amount',0)->first();
                    $data                           = [
                        'user_id'                   => auth()->id(),
                        'plan_id'                   => $plan ? $plan->id : 28,
                        'exp_date'                  => Carbon::now()->addMonths(1),
                        'purchase_date'             => Carbon::now(),
                        'plan_type'                 => $plan->plan_type,
                        'status'                    => 1,
                        'plan_amount'               => $plan->plan_amount,
                        'email_account'             => $plan->email_account,
                        'plan_number_users'         => $plan->plan_number_users,
                        'plan_number_email'         => $plan->plan_number_email,
                        'plan_credit'               => $plan->plan_credit,
                        'custom_credit'             => $plan->custom_credit ?? 250,
                        'stripe_subscription_id'    => 0,
                    ];
                    $subscription = user_plan::create($data);
                }
            }
            $total_credits              = $subscription && $subscription->plan ? $subscription->plan_credit : 0;

            $data                       = [
                'data'                  => [
                    'total_credits'     => $subscription && $subscription->plan ? number_format($total_credits) : number_format(250),
                    'used_credits'      => $subscription && $subscription->plan ? number_format($subscription->used_credit) : 0,
                    'custom_credits'    => number_format(UserCredit::sum('credits')),
                ]
            ];

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something Went Wrong'
            ],403);
        }
    }
}
