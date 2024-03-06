<?php

namespace App\Models\Emails;

use App\Models\DripContact;
use App\Models\DripEmail;
use App\Models\UniboxThread;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DripCampaign extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $casts    = [
        'smtp_id'       => 'array',
        'from_email'    => 'array',
        'from_name'     => 'array'
    ];

    protected $appends = ['campaign_date'];

    public function list(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(EmailList::class);
    }
    public function cmpOpen()
    {
        return $this->hasMany(DripOpen::class, 'drip_id', 'id');
    }

    public function cmpClick()
    {
        return $this->hasMany(DripClick::class, 'drip_id', 'id');
    }

    public function timeFilter()
    {
        return $this->hasOne(TimeFilter::class, 'drip_id', 'id');
    }

    public function subscribers(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(EmailListSubscriber::class,'list_id','list_id')->where('status',1)->latest();
    }

    public function replayedSubscriber()
    {
        return $this->hasMany(DripReply::class, 'drip_id')
        ->select('drip_replies.*')
        ->where('status', 1)
        ->where('is_deleted', 0)
        ->whereIn('id', function ($query) {
            $query->selectRaw('MAX(id)')
                ->from('drip_replies')
                ->groupBy('unibox_thread_id');
        });
    }

    public function emailSubscribers(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(EmailListSubscriber::class,'list_id','list_id')->latest();
    }

    public function unSubscribes(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(EmailListSubscriber::class,'list_id','list_id')->where('subscriber',0);
    }

    public function replies(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(DripReply::class,'drip_id')->latest();
    }
    public function opens(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(DripOpen::class,'drip_id')->latest();
    }

    public function contacts(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(DripContact::class,'drip_id')->latest();
    }

    public function emails(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(DripEmail::class,'list_id')->where('status',1);
    }
    public function sequences(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(DripSequence::class,'drip_id');
    }

    public function getOpenStatAttribute(): int
    {
        return $this->opens()->groupBy('sequence_id')->count();
    }
    public function getClickStatAttribute(): int
    {
        return $this->cmpClick()->groupBy('sequence_id')->count();
    }

    public function getCampaignDateAttribute(): string
    {
        return Carbon::parse($this->created_at)->format('h:i m-d-Y');
    }
}
