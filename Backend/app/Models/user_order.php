<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class user_order extends Model
{
    use HasFactory;

    protected $connection = 'tenant';
    protected $table = 'user_order';



    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function getUsr()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
}
