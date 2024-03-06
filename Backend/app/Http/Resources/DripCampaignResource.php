<?php

namespace App\Http\Resources;

use App\Models\Emails\DripReply;
use App\Models\UniboxThread;
use AWS\CRT\Log;
use Illuminate\Http\Resources\Json\JsonResource;

class DripCampaignResource extends JsonResource
{
    public function toArray($request): array
    {
        $reply = DripReply::where('drip_id',$this->id)->where('is_deleted',0)->distinct('unibox_thread_id')->count();
        return [
            'id'                        => $this->id,
            'campaign_name'             => $this->campaign_name,
            'from_name'                 => $this->from_name,
            'campaign_date'             => $this->campaign_date,
            'status'                    => $this->status,
            'emails_count'              => $this->emails_count,
            'email_subscribers_count'   => $this->email_subscribers_count,
            'replies_count'             => $reply,
            'clicks_count'              => (int)$this->total_click,
            'opens_count'               => (int)$this->total_open,
        ];
    }
}
