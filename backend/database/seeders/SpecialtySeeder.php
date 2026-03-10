<?php

namespace Database\Seeders;

use App\Models\Specialty;
use Illuminate\Database\Seeder;

class SpecialtySeeder extends Seeder
{
    public function run(): void
    {
        // Nettoyer les emojis des specialites existantes
        Specialty::all()->each(function ($s) {
            if ($s->icon && preg_match('/[\x{1F000}-\x{1FFFF}|\x{2600}-\x{27BF}|\x{FE00}-\x{FEFF}]/u', $s->icon)) {
                $s->update(['icon' => null]);
            }
        });

        $specialties = [
            ['name' => 'Medecine Generale', 'description' => 'Consultations generales, bilans de sante, suivi medical courant', 'icon' => 'stethoscope'],
            ['name' => 'Cardiologie', 'description' => 'Maladies du coeur et des vaisseaux sanguins', 'icon' => 'heart-pulse'],
            ['name' => 'Pediatrie', 'description' => 'Soins medicaux pour les enfants et adolescents', 'icon' => 'baby'],
            ['name' => 'Gynecologie', 'description' => 'Sante reproductive et suivi de grossesse', 'icon' => 'person-pregnant'],
            ['name' => 'Dermatologie', 'description' => 'Maladies de la peau, des cheveux et des ongles', 'icon' => 'hand-dots'],
            ['name' => 'Ophtalmologie', 'description' => 'Maladies et troubles de la vision', 'icon' => 'eye'],
            ['name' => 'ORL', 'description' => 'Oto-rhino-laryngologie : oreilles, nez, gorge', 'icon' => 'ear-listen'],
            ['name' => 'Neurologie', 'description' => 'Maladies du systeme nerveux', 'icon' => 'brain'],
            ['name' => 'Pneumologie', 'description' => 'Maladies des poumons et des voies respiratoires', 'icon' => 'lungs'],
            ['name' => 'Orthopedie', 'description' => 'Maladies des os, articulations et muscles', 'icon' => 'bone'],
            ['name' => 'Stomatologie', 'description' => 'Soins dentaires et chirurgie buccale', 'icon' => 'tooth'],
            ['name' => 'Urologie', 'description' => 'Maladies du systeme urinaire', 'icon' => 'microscope'],
        ];

        foreach ($specialties as $specialty) {
            Specialty::updateOrCreate(
                ['name' => $specialty['name']],
                $specialty
            );
        }
    }
}
