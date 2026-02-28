<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PreConsultation extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'symptoms_selected',
        'suggested_specialty_id',
        'confidence_score',
        'additional_notes',
    ];

    protected $casts = [
        'symptoms_selected' => 'array',
        'confidence_score' => 'decimal:2',
    ];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function suggestedSpecialty()
    {
        return $this->belongsTo(Specialty::class, 'suggested_specialty_id');
    }

    public function appointment()
    {
        return $this->hasOne(Appointment::class);
    }
}
