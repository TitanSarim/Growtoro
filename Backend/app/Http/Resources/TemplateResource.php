<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class TemplateResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'content'       => $this->description,
            'subject'       => $this->subject,
            'tags'          => $this->tags,
            'status'        => $this->status,
            'can_delete'    => 1
        ];
    }
}
