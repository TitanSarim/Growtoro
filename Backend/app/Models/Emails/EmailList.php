<?php

namespace App\Models\Emails;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailList extends Model
{
    use HasFactory;
    protected $fillable = ['list_name','list_uid','user_id'];
    protected $guarded = [];

    public function getSubscriber()
    {
        return $this->hasMany(EmailListSubscriber::class, 'list_id', 'id');
    }
}
