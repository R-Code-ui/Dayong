<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    // Relationship with contributions (will be used later)
    public function contributions()
    {
        return $this->hasMany(Contribution::class);
    }
}
