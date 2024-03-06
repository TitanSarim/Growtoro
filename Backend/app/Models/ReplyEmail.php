<?php

namespace App\Models;

use App\Models\Emails\DripReply;
use App\Models\Emails\EmailAccount;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReplyEmail extends Model
{
    use HasFactory;

    protected $fillable = ['drip_reply_id','smtp_id','to_mail','cc','bcc','subject','body','lead_status','ordering','follow_up_days','status'];

    protected $casts    = [
        'to_mail'       => 'array',
        'cc'            => 'array',
        'bcc'           => 'array'
    ];

    public function reply(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(DripReply::class,'drip_reply_id');
    }

    public function emailAccount(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(EmailAccount::class,'smtp_id');
    }
}
