<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SubscriberResource extends JsonResource
{
    public function toArray($request)
    {
        $others_data = json_decode($this->other,true);

        return [
            'id'            => $this->id,
            'first_name'    => array_key_exists('first_name',$others_data) ? $others_data['first_name'] : '',
            'last_name'     => array_key_exists('last_name',$others_data) ? $others_data['last_name'] : '',
            'email'         => $this->email,
        ];
    }
}
