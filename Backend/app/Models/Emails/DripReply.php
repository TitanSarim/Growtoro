<?php

namespace App\Models\Emails;

use App\Models\ReplyEmail;
use App\Models\UniboxThread;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DripReply extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $fillable = ['drip_id','email','subject','body','to_mail','status','lead_status','ordering','email_msgno','email_uid','is_deleted','cc','bcc','unibox_thread_id','follow_up_days'];

    protected $casts    = [
        'to_mail'       => 'array',
        'cc'            => 'array',
        'bcc'           => 'array'
    ];

    public function campaign()
    {
        return $this->belongsTo('App\Models\Emails\DripCampaign','drip_id','id');
    }
    public function thread(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(UniboxThread::class,'unibox_thread_id');
    }

    public function replies(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ReplyEmail::class,'drip_reply_id');
    }

    public function emailAccount(): \Illuminate\Database\Eloquent\Relations\belongsTo
    {
        return $this->belongsTo(EmailAccount::class,'to_mail','smtp_from_email');
    }
}
