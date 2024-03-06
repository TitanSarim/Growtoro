<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class PlanResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'date'          => Carbon::parse($this->purchase_date)->format('F d, Y'),
            'type'          => @$this->plan->plan_name,
        ];
    }
}
