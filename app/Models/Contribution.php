<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contribution extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id', 'event_id', 'has_money', 'has_rice',
        'date_given', 'status', 'notes', 'updated_by'
    ];

    protected $casts = [
        'has_money' => 'boolean',
        'has_rice' => 'boolean',
        'date_given' => 'date',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // Auto‑set status based on money/rice
    public function updateStatus()
    {
        if ($this->has_money && $this->has_rice) {
            $this->status = 'completed';
        } elseif ($this->has_money || $this->has_rice) {
            $this->status = 'partial';
        } else {
            $this->status = 'pending';
        }
        $this->saveQuietly(); // avoid recursion
    }
}
