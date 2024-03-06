<?php

namespace App\Repositories;

use App\Models\all_plan;
use App\Repositories\Interfaces\APIUserPaymentInterface;

class APIUserPaymentRepository implements APIUserPaymentInterface
{
    public function create_payment($request, $user_id)
    {
        $get_plan_data = $this->get_plan_data($request->plan_id);
        $this->stripe_pay($request, $user_id,$get_plan_data);
        return 'done';
    }

    private function get_plan_data($id)
    {
        $plan = all_plan::where('id',$id)->first();
        return $plan;
    }


    public function checkout_payment($request, $user_id)
    {
        $this->checkout_stripe($request, $user_id);
        return 'done';
    }


    private function stripe_pay($request, $user_id,$get_plan_data)
    {
               $stripe = new \Stripe\StripeClient(
           env('STRIPE_SECRET_KEY')
       );

       $charge = $stripe->tokens->create([
           'card' => [
               'number' => $request->card_number,
               'exp_month' => $request->exp_month,
               'exp_year' => $request->exp_year,
               'cvc' => $request->cvc,
           ],
       ]);

       $stripe->charges->create([
           'amount' => $get_plan_data->plan_amount * 100,
           'currency' => 'usd',
           'source' => $charge->id,
           'description' => 'Purchase Plan :'.$get_plan_data->plan_name,
       ]);

    }


    private function checkout_stripe($request)
    {
        $stripe = new \Stripe\StripeClient(
            env('STRIPE_SECRET_KEY')
        );
 
        $charge = $stripe->tokens->create([
            'card' => [
                'number' => $request->card_number,
                'exp_month' => $request->exp_month,
                'exp_year' => $request->exp_year,
                'cvc' => $request->cvc,
            ],
        ]);
 
        $stripe->charges->create([
            'amount' => $request->total_amount * 100,
            'currency' => 'usd',
            'source' => $charge->id,
            'description' => 'payment plan',
        ]);
    }
}
