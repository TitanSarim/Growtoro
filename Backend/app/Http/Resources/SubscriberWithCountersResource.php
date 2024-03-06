<?php

namespace App\Http\Resources;

use App\Models\Emails\DripCampaign;
use App\Models\Emails\DripReply;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriberWithCountersResource extends JsonResource
{
    public function toArray($request)
    {
        $others_data = json_decode($this->other,true);
        $campaign_id = @$this->campaign->id;

        return [
            'id'            => $this->id,
            'first_name'    => array_key_exists('first_name',$others_data) ? $others_data['first_name'] : '',
            'last_name'     => array_key_exists('last_name',$others_data) ? $others_data['last_name'] : '',
            'email'         => $this->email,
            'opens'         => (int)$this->total_open,
            'clicks'        => (int)$this->total_click,
            'contacted'     => $this->contacted_count,
            'replies'       => (int)DripReply::where('drip_id',$campaign_id)->where('email',$this->email)->count()
        ];
    }
}
