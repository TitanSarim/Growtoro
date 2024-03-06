<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tenant_db_name extends Model
{
    use HasFactory;

    protected $connection = 'server_one';
}
