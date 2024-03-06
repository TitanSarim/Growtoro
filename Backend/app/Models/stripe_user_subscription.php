<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class stripe_user_subscription extends Model
{
    use HasFactory;

    protected $connection = 'tenant';
    protected $table = 'user_stripe_subscription';
}
