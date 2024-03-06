<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAddon extends Model
{
    use HasFactory;

    protected $connection = 'tenant';

    protected $fillable = [
        'user_id',
        'addon_id',
        'exp_date',
        'purchase_date',
        'credits',
        'emails',
        'price',
        'stripe_subscription_id',
        'status'
    ];

    public function addon(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Addon::class);
    }
}
