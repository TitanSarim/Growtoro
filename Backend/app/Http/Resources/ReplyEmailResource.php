<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class ReplyEmailResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'            => $this->id,
            'email'         => $this->smtp_id,
            'to_email'      => count($this->to_mail) > 0 ? implode(',',$this->to_mail) : $this->to_mail[0],
            'Re'            => $this->subject,
            'emailBody'     => $this->body,
            'cc'            => $this->cc,
            'bcc'           => $this->bcc,
            'status'        => $this->status,
            'lead_status'   => $this->lead_status,
            'date'          => Carbon::parse($this->created_at)->format('M d, Y'),
            'body_date'     => Carbon::parse($this->created_at)->format('D, M d, Y h:i A')
        ];
    }
}
