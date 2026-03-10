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
        'ai_recommendation',
    ];

    protected $casts = [
        'symptoms_selected' => 'array',
        'confidence_score' => 'decimal:2',
    ];

    /**
     * Le patient qui a fait la preconsultation.
     */
    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    /**
     * Alias pour patient() - utilise par DoctorController::preConsultations()
     * qui charge with(['user:id,name,email,phone'])
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    /**
     * Specialite suggeree par l'algorithme IA.
     */
    public function suggestedSpecialty()
    {
        return $this->belongsTo(Specialty::class, 'suggested_specialty_id');
    }

    /**
     * Rendez-vous lie a cette preconsultation.
     */
    public function appointment()
    {
        return $this->hasOne(Appointment::class);
    }

    /**
     * Symptomes selectionnes (many-to-many via table pivot).
     * Fallback: si pas de table pivot, les IDs sont dans symptoms_selected (JSON).
     */
    public function symptoms()
    {
        return $this->belongsToMany(Symptom::class, 'pre_consultation_symptom');
    }
}
