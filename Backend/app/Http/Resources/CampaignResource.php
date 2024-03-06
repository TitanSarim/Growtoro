<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CampaignResource extends JsonResource
{
    public function toArray($request): array
    {
        $total_subscribers  = $this->email_subscribers_count;
        $open_counter       = $this->opens_count;
        $reply_counter      = $this->replayed_subscriber_count;
        $contacts_counter   = $this->emails_count;

        return [
            'id'                    => $this->id,
            'name'                  => $this->campaign_name,
            'status'                => (bool)$this->status,
            'contacted'             => $contacts_counter,
            'opened'                => $open_counter,
            'opened_percentage'     => $total_subscribers == 0 || $open_counter == 0 ? 0 : round(($open_counter / $total_subscribers)*100,2),
            'replied'               => $reply_counter,
            'replied_percentage'    => $total_subscribers == 0 || $reply_counter == 0 ? 0 : round(($reply_counter / $total_subscribers)*100,2),
            'combined_score'        => 0,
        ];
    }
}
