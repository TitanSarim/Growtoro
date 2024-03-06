<?php

namespace App\Repositories;

use App\Models\all_plan;
use App\Repositories\Interfaces\AdminPlanInterface;

class AdminPlanRepository implements AdminPlanInterface
{
    public function get_all_plan()
    {
        $plans = all_plan::subscriptionPlan()->orderBy('id', 'desc')->paginate(20);
        return $plans;
    }


    public function get_credit_plan()
    {
        $plans = all_plan::creditPlan()->orderBy('id', 'desc')->paginate(20);
        return $plans;
    }
}
