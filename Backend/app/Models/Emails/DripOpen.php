<?php

namespace App\Models\Emails;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DripOpen extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $fillable = ['drip_id','subscriber_id','count','smtp_id','sequence_id'];
}
