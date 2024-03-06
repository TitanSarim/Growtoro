<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class user_plan extends Model
{
    use HasFactory;

    protected $connection = 'tenant';
    protected $table = 'user_plan';
    protected $fillable = ['user_id','plan_id','exp_date','purchase_date','plan_type','status','plan_amount','email_account',
        'plan_credit','plan_number_email','plan_number_users','custom_credit','stripe_subscription_id','used_credit'];
    public function plan()
    {
        return $this->hasOne(all_plan::class, 'id', 'plan_id');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function scopeSubscriptionPlan($query)
    {
        return $query->where('plan_type', 1);
    }

    public function scopeCreditPlan($query)
    {
        return $query->where('plan_type', 2);
    }
}
