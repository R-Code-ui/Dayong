<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'date', 'is_active'];

    protected $casts = [
        'date' => 'date',
        'is_active' => 'boolean',
    ];

    public function contributions()
    {
        return $this->hasMany(Contribution::class);
    }

    // Helper to deactivate all other events
    public static function setActiveEvent($eventId)
    {
        self::where('id', '!=', $eventId)->update(['is_active' => false]);
        self::where('id', $eventId)->update(['is_active' => true]);
    }
}
