<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscribeLink extends Model
{
    use HasFactory;

    protected $connection = 'server_one';

}
