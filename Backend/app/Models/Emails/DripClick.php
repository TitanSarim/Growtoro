<?php

namespace App\Models\Emails;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DripClick extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $fillable = ['drip_id','subscriber_id','count','sequence_id'];
}
