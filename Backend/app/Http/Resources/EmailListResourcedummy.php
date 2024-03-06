<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class EmailListResourcedummy extends JsonResource
{
    public function toArray($request): array
    {
        $emails[]               = [];
        $headers                = [];
        foreach ($this->getSubscriber as $item) {
            $others             = json_decode($item->other,true);
            $array_keys         = array_keys($others);
            $row                = [];
            $excluded_keys      = ['tenant_id','list_id','id'];

            foreach ($array_keys as $array_key)
            {
                $in_upper_case = ucwords(str_replace('_',' ',$array_key));
                if (!in_array($array_key,$excluded_keys))
                {
                    $row[] = $others[$array_key];
                    $headers[] = $in_upper_case;
                }
                $emails[0] = $headers;
            }

            $emails[]           = $row;
            $headers            = [];
        }

        return [
            'id'            => $this->id,
            'name'          => $this->list_name,
            'last_modified' => Carbon::parse($this->updated_at)->format('Y-m-d H:i'),
            'emails'        => $emails
        ];
    }

  /*  public function toArray($request): array
    {
        $emails                 = [];
        foreach ($this->getSubscriber as $item) {
            $others             = json_decode($item->other,true);
            $array_keys         = array_keys($others);

            $emails[]           = $others;
        }

        return [
            'id'            => $this->id,
            'name'          => $this->list_name,
            'last_modified' => Carbon::parse($this->updated_at)->format('Y-m-d H:i'),
            'emails'        => $emails
        ];
    }*/
}
