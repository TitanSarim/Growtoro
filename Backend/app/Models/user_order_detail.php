<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class user_order_detail extends Model
{
    use HasFactory;

    protected $connection = 'tenant';
    protected $table = 'user_order_detail';


    public function plan()
    {
        return $this->hasOne(all_plan::class, 'id', 'plan_id');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
}
