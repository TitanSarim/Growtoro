<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class UniboxResource extends JsonResource
{
    public function toArray($request)
    {
        $last_reply = $this->lastReply;

        return [
            'id'            => $this->id,
            'email'         => $this->recipient_mail,
            'to_email'      => $this->sender_mail,
            'smtp_id'       => @$this->emailAccount->id,
            'Re'            => $last_reply->subject,
            'emailBody'     => $last_reply->body,
            'attachments'   => json_decode($last_reply->attachment),
            'lead_status'   => $this->lead_status,
            'status'        => $last_reply->status,
            'date'          => Carbon::parse($last_reply->created_at)->format('M d, Y'),
            'body_date'     => Carbon::parse($last_reply->created_at)->format('D, M d, Y h:i A'),
        ];
    }
}
