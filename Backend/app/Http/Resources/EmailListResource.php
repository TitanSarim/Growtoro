<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class EmailListResource extends JsonResource
{
    public function toArray($request): array
    {
        $other_data                 = [];
        foreach ($this->getSubscriber as $item)
        {
            $others             = json_decode($item->other,true);
            // $converted          = [];
            // foreach ($others as $key => $value) {
            //     $convertedKey               = ucwords(str_replace('_', ' ', $key));
            //     $converted[$convertedKey]   = $value;
            // }
            $other_data[]           = $others;
        }

        return [
            'id'                => $this->id,
            'name'              => $this->list_name,
            'type'              => !empty($this->getSubscriber[0]->type) ? $this->getSubscriber[0]->type : '',
            'last_modified'     => Carbon::parse($this->updated_at)->format('Y-m-d H:i'),
            'emails'            => $this->get_subscriber_count,
            'subscribers_data'  => $other_data
        ];
    }
}
