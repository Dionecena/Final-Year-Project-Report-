<?php

namespace Database\Seeders;

use App\Models\Specialty;
use Illuminate\Database\Seeder;

class SpecialtySeeder extends Seeder
{
    public function run(): void
    {
        $specialties = [
            ['name' => 'Médecine Générale', 'description' => 'Consultations générales, bilans de santé, suivi médical courant', 'icon' => '🏥'],
            ['name' => 'Cardiologie', 'description' => 'Maladies du cœur et des vaisseaux sanguins', 'icon' => '❤️'],
            ['name' => 'Pédiatrie', 'description' => 'Soins médicaux pour les enfants et adolescents', 'icon' => '👶'],
            ['name' => 'Gynécologie', 'description' => 'Santé reproductive et suivi de grossesse', 'icon' => '🤰'],
            ['name' => 'Dermatologie', 'description' => 'Maladies de la peau, des cheveux et des ongles', 'icon' => '🧴'],
            ['name' => 'Ophtalmologie', 'description' => 'Maladies et troubles de la vision', 'icon' => '👁️'],
            ['name' => 'ORL', 'description' => 'Oto-rhino-laryngologie : oreilles, nez, gorge', 'icon' => '👂'],
            ['name' => 'Neurologie', 'description' => 'Maladies du système nerveux', 'icon' => '🧠'],
            ['name' => 'Pneumologie', 'description' => 'Maladies des poumons et des voies respiratoires', 'icon' => '🫁'],
            ['name' => 'Orthopédie', 'description' => 'Maladies des os, articulations et muscles', 'icon' => '🦴'],
            ['name' => 'Stomatologie', 'description' => 'Soins dentaires et chirurgie buccale', 'icon' => '🦷'],
            ['name' => 'Urologie', 'description' => 'Maladies du système urinaire', 'icon' => '🔬'],
        ];

        foreach ($specialties as $specialty) {
            Specialty::create($specialty);
        }
    }
}
