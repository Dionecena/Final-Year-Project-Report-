<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\PreConsultation;
use App\Models\Schedule;
use App\Models\Specialty;
use App\Models\Symptom;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Creation des donnees de test...');

        // ============================================
        // 1. MEDECINS (4 medecins avec specialites)
        // ============================================
        $doctors = [
            [
                'user' => ['name' => 'Dr. Amadou Diallo', 'email' => 'dr.diallo@mediconsult.com', 'phone' => '771234567', 'role' => 'doctor'],
                'doctor' => ['bio' => 'Cardiologue experimentee, 15 ans de pratique au CHU de Dakar', 'license_number' => 'MED-2024-001'],
                'specialty' => 'Cardiologie',
            ],
            [
                'user' => ['name' => 'Dr. Fatou Sow', 'email' => 'dr.sow@mediconsult.com', 'phone' => '772345678', 'role' => 'doctor'],
                'doctor' => ['bio' => 'Pediatre specialisee en neonatologie', 'license_number' => 'MED-2024-002'],
                'specialty' => 'Pediatrie',
            ],
            [
                'user' => ['name' => 'Dr. Moussa Ndiaye', 'email' => 'dr.ndiaye@mediconsult.com', 'phone' => '773456789', 'role' => 'doctor'],
                'doctor' => ['bio' => 'Medecin generaliste, cabinet prive a Plateau', 'license_number' => 'MED-2024-003'],
                'specialty' => 'Medecine Generale',
            ],
            [
                'user' => ['name' => 'Dr. Aissatou Ba', 'email' => 'dr.ba@mediconsult.com', 'phone' => '774567890', 'role' => 'doctor'],
                'doctor' => ['bio' => 'Dermatologue, specialiste en dermatologie esthetique', 'license_number' => 'MED-2024-004'],
                'specialty' => 'Dermatologie',
            ],
        ];

        foreach ($doctors as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['user']['email']],
                array_merge($data['user'], ['password' => Hash::make('Doctor@1234!'), 'is_active' => true])
            );

            $specialty = Specialty::where('name', $data['specialty'])->first();

            Doctor::firstOrCreate(
                ['user_id' => $user->id],
                array_merge($data['doctor'], ['user_id' => $user->id, 'specialty_id' => $specialty?->id])
            );

            // Creer des creneaux pour chaque medecin (lundi-vendredi, 8h-17h)
            if ($specialty) {
                foreach (['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as $day) {
                    Schedule::firstOrCreate(
                        ['doctor_id' => $user->doctor->id ?? Doctor::where('user_id', $user->id)->first()->id, 'day_of_week' => $day],
                        [
                            'doctor_id' => $user->doctor->id ?? Doctor::where('user_id', $user->id)->first()->id,
                            'day_of_week' => $day,
                            'start_time' => '08:00',
                            'end_time' => '17:00',
                            'slot_duration' => 30,
                            'is_active' => true,
                        ]
                    );
                }
            }
        }

        $this->command->info('4 medecins crees avec leurs creneaux.');

        // ============================================
        // 2. PATIENTS (6 patients)
        // ============================================
        $patients = [
            ['name' => 'Ousmane Fall', 'email' => 'ousmane.fall@gmail.com', 'phone' => '775001001'],
            ['name' => 'Mariama Diop', 'email' => 'mariama.diop@gmail.com', 'phone' => '775002002'],
            ['name' => 'Ibrahima Sy', 'email' => 'ibrahima.sy@gmail.com', 'phone' => '775003003'],
            ['name' => 'Awa Niang', 'email' => 'awa.niang@gmail.com', 'phone' => '775004004'],
            ['name' => 'Cheikh Mbaye', 'email' => 'cheikh.mbaye@gmail.com', 'phone' => '775005005'],
            ['name' => 'Ndoye Coumba', 'email' => 'ndoye.coumba@gmail.com', 'phone' => '775006006'],
        ];

        foreach ($patients as $patient) {
            User::firstOrCreate(
                ['email' => $patient['email']],
                array_merge($patient, ['password' => Hash::make('Patient@1234!'), 'role' => 'patient', 'is_active' => true])
            );
        }

        $this->command->info('6 patients crees.');

        // ============================================
        // 3. RENDEZ-VOUS (8 rendez-vous varies)
        // ============================================
        $drDiallo = Doctor::whereHas('user', fn($q) => $q->where('email', 'dr.diallo@mediconsult.com'))->first();
        $drSow = Doctor::whereHas('user', fn($q) => $q->where('email', 'dr.sow@mediconsult.com'))->first();
        $drNdiaye = Doctor::whereHas('user', fn($q) => $q->where('email', 'dr.ndiaye@mediconsult.com'))->first();
        $drBa = Doctor::whereHas('user', fn($q) => $q->where('email', 'dr.ba@mediconsult.com'))->first();

        $ousmane = User::where('email', 'ousmane.fall@gmail.com')->first();
        $mariama = User::where('email', 'mariama.diop@gmail.com')->first();
        $ibrahima = User::where('email', 'ibrahima.sy@gmail.com')->first();
        $awa = User::where('email', 'awa.niang@gmail.com')->first();
        $cheikh = User::where('email', 'cheikh.mbaye@gmail.com')->first();
        $ndoye = User::where('email', 'ndoye.coumba@gmail.com')->first();

        if ($drDiallo && $drSow && $drNdiaye && $drBa && $ousmane && $mariama) {
            $appointments = [
                // Rendez-vous passes (confirmes)
                ['patient_id' => $ousmane->id, 'doctor_id' => $drDiallo->id, 'scheduled_at' => now()->subDays(5)->setTime(9, 0), 'status' => 'completed', 'reason' => 'Douleur thoracique recurrente', 'notes' => 'ECG normal, stress professionnel identifie'],
                ['patient_id' => $mariama->id, 'doctor_id' => $drSow->id, 'scheduled_at' => now()->subDays(3)->setTime(10, 30), 'status' => 'completed', 'reason' => 'Consultation pediatrique de routine', 'notes' => 'Croissance normale, vaccinations a jour'],

                // Rendez-vous aujourd hui
                ['patient_id' => $ibrahima->id, 'doctor_id' => $drNdiaye->id, 'scheduled_at' => now()->setTime(14, 0), 'status' => 'confirmed', 'reason' => 'Fatigue persistante et maux de tete'],
                ['patient_id' => $awa->id, 'doctor_id' => $drBa->id, 'scheduled_at' => now()->setTime(15, 30), 'status' => 'confirmed', 'reason' => 'Eruption cutanee sur les bras'],

                // Rendez-vous futurs
                ['patient_id' => $cheikh->id, 'doctor_id' => $drDiallo->id, 'scheduled_at' => now()->addDays(2)->setTime(9, 0), 'status' => 'pending', 'reason' => 'Palpitations cardiaques'],
                ['patient_id' => $ndoye->id, 'doctor_id' => $drSow->id, 'scheduled_at' => now()->addDays(3)->setTime(11, 0), 'status' => 'pending', 'reason' => 'Fievre recurrente chez enfant de 3 ans'],
                ['patient_id' => $ousmane->id, 'doctor_id' => $drNdiaye->id, 'scheduled_at' => now()->addDays(5)->setTime(10, 0), 'status' => 'confirmed', 'reason' => 'Suivi medical general'],

                // Rendez-vous annule
                ['patient_id' => $mariama->id, 'doctor_id' => $drDiallo->id, 'scheduled_at' => now()->subDays(1)->setTime(16, 0), 'status' => 'cancelled', 'reason' => 'Controle tension arterielle', 'cancellation_reason' => 'Empechement personnel de la patiente'],
            ];

            foreach ($appointments as $appt) {
                Appointment::create($appt);
            }

            $this->command->info('8 rendez-vous crees.');
        }

        // ============================================
        // 4. PRE-CONSULTATIONS (3 pre-consultations IA)
        // ============================================
        $cardio = Specialty::where('name', 'Cardiologie')->first();
        $pneumo = Specialty::where('name', 'Pneumologie')->first();
        $neuro = Specialty::where('name', 'Neurologie')->first();

        if ($ousmane && $cardio) {
            $pc1 = PreConsultation::create([
                'patient_id' => $ousmane->id,
                'symptoms_selected' => json_encode(['Douleur thoracique', 'Palpitations cardiaques', 'Essoufflement']),
                'suggested_specialty_id' => $cardio->id,
                'confidence_score' => 0.92,
                'additional_notes' => 'Patient signale des douleurs thoraciques depuis 2 semaines, surtout a l effort',
                'ai_recommendation' => 'Consultation cardiologique urgente recommandee. Les symptomes (douleur thoracique + palpitations + essoufflement) suggerent une evaluation cardiaque approfondie avec ECG et echocardiographie.',
                'status' => 'completed',
            ]);

            // Lier les symptomes via la table pivot
            $symptomNames = ['Douleur thoracique', 'Palpitations cardiaques', 'Essoufflement'];
            $symptomIds = Symptom::whereIn('name', $symptomNames)->pluck('id');
            if ($pc1 && method_exists($pc1, 'symptoms')) {
                try { $pc1->symptoms()->sync($symptomIds); } catch (\Exception $e) {}
            }
        }

        if ($ibrahima && $neuro) {
            $pc2 = PreConsultation::create([
                'patient_id' => $ibrahima->id,
                'symptoms_selected' => json_encode(['Maux de tete severes', 'Vertiges', 'Fatigue intense']),
                'suggested_specialty_id' => $neuro->id,
                'confidence_score' => 0.78,
                'additional_notes' => 'Maux de tete quotidiens depuis 1 mois, vertiges au lever',
                'ai_recommendation' => 'Consultation neurologique conseillee. Association cephalees severes + vertiges necessite un bilan neurologique. Scanner cerebral potentiellement indique.',
                'status' => 'pending',
            ]);

            $symptomNames2 = ['Maux de tete severes', 'Vertiges', 'Fatigue intense'];
            $symptomIds2 = Symptom::whereIn('name', $symptomNames2)->pluck('id');
            if ($pc2 && method_exists($pc2, 'symptoms')) {
                try { $pc2->symptoms()->sync($symptomIds2); } catch (\Exception $e) {}
            }
        }

        if ($cheikh && $pneumo) {
            PreConsultation::create([
                'patient_id' => $cheikh->id,
                'symptoms_selected' => json_encode(['Toux persistante', 'Essoufflement', 'Sifflement respiratoire']),
                'suggested_specialty_id' => $pneumo->id,
                'confidence_score' => 0.88,
                'additional_notes' => 'Toux seche depuis 1 mois, aggravee la nuit',
                'ai_recommendation' => 'Consultation pneumologique recommandee. Suspicion d asthme ou de bronchopathie chronique. Spirometrie conseillee.',
                'status' => 'pending',
            ]);
        }

        $this->command->info('3 pre-consultations IA creees.');
        $this->command->info('--- Donnees de test inserees avec succes ! ---');
    }
}
