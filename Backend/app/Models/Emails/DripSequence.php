<?php

namespace App\Models\Emails;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DripSequence extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function getCombinedDateTimeAttribute()
    {
        // Get the date portion from the 'date' field
        $datePart = $this->attributes['start_date'];

        // Get the time portion from the 'created_at' field
        $timePart = $this->created_at->toTimeString();

        // Combine date and time, and format it as 'Y-m-d H:i:s'
        $combinedDateTime = "{$datePart} 00:00:00";

        return (new \DateTime($combinedDateTime))->format('Y-m-d H:i:s');
    }
}
