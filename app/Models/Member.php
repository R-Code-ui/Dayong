<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'user_id'];

    public function contributions()
    {
        return $this->hasMany(Contribution::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
