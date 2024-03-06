<?php

namespace App\Models\Emails;

use App\Models\DripEmail;
use App\Models\UniboxThread;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailAccount extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function todayEmailSent(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        $today      = Carbon::today();
        $start_date = $today->format('Y-m-d').' 00:00:00';
        $end_date   = $today->format('Y-m-d').' 23:59:59';

        return $this->hasMany(DripEmail::class,'email_account_id')->where('status',1)->whereBetween('created_at',[$start_date,$end_date]);
    }
    public function EmailSent(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(DripEmail::class,'email_account_id');
    }

    public function replies(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(DripReply::class,'to_mail','smtp_from_email');
    }
    public function threads(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(UniboxThread::class,'sender_mail','smtp_from_email');
    }

    public function open()
    {
        return $this->hasMany(DripOpen::class,'smtp_id');
    }

    public function getNameAttribute()
    {
        return $this->smtp_first_name .' '.$this->smtp_last_name;
    }
}
