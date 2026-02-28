<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Symptom extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'category',
    ];

    public function specialties()
    {
        return $this->belongsToMany(Specialty::class, 'symptom_specialty')
            ->withPivot('weight');
    }
}
