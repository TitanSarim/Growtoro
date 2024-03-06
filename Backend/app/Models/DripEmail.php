<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DripEmail extends Model
{
    use HasFactory;

    protected $fillable = ['email_account_id','subscriber_id','list_id','subscriber_email','status','sequence_id'];
}
