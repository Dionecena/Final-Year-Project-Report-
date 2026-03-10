<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\PreConsultation;
use App\Models\Schedule;
use App\Models\User;
use App\Models\Specialty;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Creation des donnees de test...');

        // =============================================
        // 1. Medecins (4 medecins, specialites variees)
        // =============================================
        $specialties = Specialty::all();

        $doctorsData = [
            ['name' => 'Dr. Amadou Diallo', 'email' => 'dr.diallo@mediconsult.com', 'specialty' => 'Cardiologie', 'bio' => 'Cardiologue avec 15 ans d\'experience', 'license' => 'MED-' . rand(1000, 9999)],
            ['name' => 'Dr. Fatou Sow', 'email' => 'dr.sow@mediconsult.com', 'specialty' => 'Dermatologie', 'bio' => 'Specialiste en dermatologie clinique', 'license' => 'MED-' . rand(1000, 9999)],
            ['name' => 'Dr. Moussa Ndiaye', 'email' => 'dr.ndiaye@mediconsult.com', 'specialty' => 'Pediatrie', 'bio' => 'Pediatre passionne par la sante infantile', 'license' => 'MED-' . rand(1000, 9999)],
            ['name' => 'Dr. Aissatou Ba', 'email' => 'dr.ba@mediconsult.com', 'specialty' => 'Ophtalmologie', 'bio' => 'Chirurgien ophtalmologue', 'license' => 'MED-' . rand(1000, 9999)],
        ];

        $doctors = [];
        foreach ($doctorsData as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => Hash::make('Doctor@1234!'),
                    'role' => 'doctor',
                    'is_active' => true,
                ]
            );

            $specialty = $specialties->firstWhere('name', $data['specialty']);

            $doctor = Doctor::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'specialty_id' => $specialty ? $specialty->id : $specialties->first()->id,
                    'bio' => $data['bio'],
                    'license_number' => $data['license'],
                ]
            );
            $doctors[] = $doctor;
        }
        $this->command->info('4 medecins crees.');

        // =============================================
        // 2. Plannings medecins (lundi-vendredi, 8h-17h)
        // =============================================
        foreach ($doctors as $doctor) {
            for ($day = 1; $day <= 5; $day++) {
                Schedule::firstOrCreate(
                    ['doctor_id' => $doctor->id, 'day_of_week' => $day],
                    [
                        'start_time' => '08:00',
                        'end_time' => '17:00',
                        'is_available' => true,
                    ]
                );
            }
        }
        $this->command->info('Plannings medecins crees (lun-ven 8h-17h).');

        // =============================================
        // 3. Patients (6 patients)
        // =============================================
        $patientsData = [
            ['name' => 'Ousmane Fall', 'email' => 'ousmane.fall@gmail.com', 'phone' => '771234567'],
            ['name' => 'Mariama Diop', 'email' => 'mariama.diop@gmail.com', 'phone' => '772345678'],
            ['name' => 'Ibrahima Sy', 'email' => 'ibrahima.sy@gmail.com', 'phone' => '773456789'],
            ['name' => 'Awa Niang', 'email' => 'awa.niang@gmail.com', 'phone' => '774567890'],
            ['name' => 'Cheikh Mbaye', 'email' => 'cheikh.mbaye@gmail.com', 'phone' => '775678901'],
            ['name' => 'Coumba Ndoye', 'email' => 'ndoye.coumba@gmail.com', 'phone' => '776789012'],
        ];

        $patients = [];
        foreach ($patientsData as $data) {
            $patient = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => Hash::make('Patient@1234!'),
                    'role' => 'patient',
                    'phone' => $data['phone'],
                    'is_active' => true,
                ]
            );
            $patients[] = $patient;
        }
        $this->command->info('6 patients crees.');

        // =============================================
        // 4. Rendez-vous (nouveau flux: specialty + reason, pas de doctor)
        // =============================================
        $cardio = $specialties->firstWhere('name', 'Cardiologie');
        $dermato = $specialties->firstWhere('name', 'Dermatologie');
        $pediatrie = $specialties->firstWhere('name', 'Pediatrie');
        $ophtalmo = $specialties->firstWhere('name', 'Ophtalmologie');

        $appointmentsData = [
            // RDV pending (sans medecin, en attente d'assignation)
            [
                'patient_id' => $patients[0]->id,
                'specialty_id' => $cardio ? $cardio->id : 1,
                'reason' => 'Douleurs thoraciques recurrentes depuis 2 semaines',
                'status' => 'pending',
            ],
            [
                'patient_id' => $patients[1]->id,
                'specialty_id' => $dermato ? $dermato->id : 2,
                'reason' => 'Eruption cutanee persistante sur les bras',
                'status' => 'pending',
            ],
            [
                'patient_id' => $patients[2]->id,
                'specialty_id' => $pediatrie ? $pediatrie->id : 3,
                'reason' => 'Fievre et toux chez mon enfant de 3 ans',
                'status' => 'pending',
            ],
            [
                'patient_id' => $patients[3]->id,
                'specialty_id' => $ophtalmo ? $ophtalmo->id : 4,
                'reason' => 'Baisse de la vision depuis quelques mois',
                'status' => 'pending',
            ],
            // RDV confirmes (medecin assigne par la secretaire)
            [
                'patient_id' => $patients[4]->id,
                'specialty_id' => $cardio ? $cardio->id : 1,
                'doctor_id' => $doctors[0]->id,
                'reason' => 'Controle de routine tension arterielle',
                'scheduled_at' => Carbon::tomorrow()->setHour(9)->setMinute(0),
                'status' => 'confirmed',
            ],
            [
                'patient_id' => $patients[5]->id,
                'specialty_id' => $dermato ? $dermato->id : 2,
                'doctor_id' => $doctors[1]->id,
                'reason' => 'Suivi traitement eczema',
                'scheduled_at' => Carbon::tomorrow()->setHour(10)->setMinute(30),
                'status' => 'confirmed',
            ],
            // RDV complete (passe)
            [
                'patient_id' => $patients[0]->id,
                'specialty_id' => $cardio ? $cardio->id : 1,
                'doctor_id' => $doctors[0]->id,
                'reason' => 'Consultation initiale cardiologie',
                'scheduled_at' => Carbon::yesterday()->setHour(14)->setMinute(0),
                'status' => 'completed',
            ],
            // RDV annule
            [
                'patient_id' => $patients[3]->id,
                'specialty_id' => $pediatrie ? $pediatrie->id : 3,
                'reason' => 'Vaccination enfant',
                'status' => 'cancelled',
                'cancellation_reason' => 'Patient indisponible a la date prevue',
            ],
        ];

        foreach ($appointmentsData as $data) {
            Appointment::create($data);
        }
        $this->command->info('8 rendez-vous crees (4 pending, 2 confirmes, 1 complete, 1 annule).');

        // =============================================
        // 5. Pre-consultations IA
        // =============================================
        PreConsultation::create([
            'patient_id' => $patients[0]->id,
            'symptoms_selected' => json_encode(['douleur_thoracique', 'essoufflement', 'palpitations']),
            'suggested_specialty_id' => $cardio ? $cardio->id : 1,
            'confidence_score' => 0.89,
            'additional_notes' => 'Symptomes cardiaques a surveiller de pres.',
        ]);

        PreConsultation::create([
            'patient_id' => $patients[1]->id,
            'symptoms_selected' => json_encode(['eruption_cutanee', 'demangeaisons', 'rougeurs']),
            'suggested_specialty_id' => $dermato ? $dermato->id : 2,
            'confidence_score' => 0.92,
            'additional_notes' => 'Possible dermatite allergique.',
        ]);

        PreConsultation::create([
            'patient_id' => $patients[2]->id,
            'symptoms_selected' => json_encode(['fievre', 'toux', 'fatigue']),
            'suggested_specialty_id' => $pediatrie ? $pediatrie->id : 3,
            'confidence_score' => 0.85,
            'additional_notes' => 'Infection respiratoire probable chez l\'enfant.',
        ]);

        $this->command->info('3 pre-consultations IA creees.');
        $this->command->info('Donnees de test generees avec succes !');
    }
}
