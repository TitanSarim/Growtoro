<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'                => $this->id,
            'plan_name'         => $this->plan_name,
            'plan_amount'       => $this->plan_amount,
            'plan_credit'       => number_format($this->plan_credit),
            'plan_number_email' => number_format($this->plan_number_email),
            'plan_number_users' => number_format($this->plan_number_users),
            'email_account'     => $this->email_account,
            'custom_credit'     => number_format($this->custom_credit) ? : 0,
            'color'             => $this->color ? : '#7B68EE',
            'stripe_plan_id'    => $this->stripe_plan_id,
        ];
    }
}
