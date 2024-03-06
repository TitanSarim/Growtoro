<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StripeSession extends Model
{
    use HasFactory;

    protected $fillable = ['tenant_id','plan_id','session_id'];
}
