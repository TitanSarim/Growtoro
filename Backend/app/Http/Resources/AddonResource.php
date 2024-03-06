<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AddonResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'                => $this->id,
            'credits'           => $this->credits,
            'emails'            => $this->emails,
            'price'             => number_format($this->price),
            'stripe_pro_id'     => $this->stripe_pro_id,
            'stripe_plan_id'    => $this->stripe_plan_id,
            'interval_type'     => $this->interval_type,
            'created_at'        => $this->created_at,
            'updated_at'        => $this->updated_at,
        ];
    }
}
