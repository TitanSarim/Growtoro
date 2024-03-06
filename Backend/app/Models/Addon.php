<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Addon extends Model
{
    use HasFactory;

    protected $connection = 'server_one';

    protected $fillable = [
        'credits',
        'emails',
        'price',
        'stripe_pro_id',
        'stripe_plan_id',
        'interval_type'
    ];
}
