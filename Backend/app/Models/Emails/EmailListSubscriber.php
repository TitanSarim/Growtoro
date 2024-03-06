<?php

namespace App\Models\Emails;

use App\Models\DripEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailListSubscriber extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function campaign()
    {
        return $this->belongsTo(DripCampaign::class,'list_id','list_id');
    }
    public function clicks(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(DripClick::class,'subscriber_id');
    }
    public function opens(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(DripOpen::class,'subscriber_id');
    }
    public function replies(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(DripReply::class, 'email', 'email')
                ->whereHas('campaign', function ($query) {
                    $query->where('id', $this->campaign->id);
                });
    }
    public function contacted(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(DripEmail::class,'subscriber_id');
    }
}
