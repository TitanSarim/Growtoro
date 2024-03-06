<?php

namespace App\Models;

use App\Models\Emails\DripReply;
use App\Models\Emails\EmailAccount;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UniboxThread extends Model
{
    use HasFactory;

    protected $fillable = ['drip_campaign_id','sender_mail','recipient_mail','is_deleted','status'];

    public function replies(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(DripReply::class,'unibox_thread_id');
    }

    public function lastReply(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(DripReply::class,'unibox_thread_id')->orderByDesc('id');
    }

    public function emailAccount(): \Illuminate\Database\Eloquent\Relations\belongsTo
    {
        return $this->belongsTo(EmailAccount::class,'sender_mail','smtp_from_email');
    }
}
