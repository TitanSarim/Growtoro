<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class template_email extends Model
{
    use HasFactory;

    protected $connection = 'server_one';

    protected $fillable = ['name','subject','description','tenant_id','tags'];

    public function deletedTemplates(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(DeletedTemplate::class,'template_email_id');
    }
}
