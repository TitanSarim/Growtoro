<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    use HasFactory;

    protected $connection = 'server_one';

    protected $fillable = ['question','answer','is_parent','status','type'];

    public function scopeActive($query)
    {
        return $query->where('status',1);
    }
}
