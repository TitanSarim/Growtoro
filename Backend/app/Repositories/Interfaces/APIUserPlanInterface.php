<?php

namespace App\Repositories\Interfaces;

interface APIUserPlanInterface
{
    public function get_subscription_plan($request, $user_id);
    public function get_product_plan($request, $user_id);

    public function get_credit_plan($request, $user_id);

    public function get_my_plan($request, $user_id);

    public function user_plan_purchase($request, $user_id);

    public function make_user_subscription_plan($request, $user_id);

    public function make_user_credit_plan($request, $user_id);
}
