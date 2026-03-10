<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\PreConsultation;
use App\Models\Schedule;
use App\Models\Specialty;
use App\Models\Symptom;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Creation des donnees de test...');

        // 1. Medecins
        $specialties = Specialty::all();
        $doctorsData = [
            ['name' => 'Dr. Amadou Diallo', 'email' => 'dr.diallo@mediconsult.com', 'specialty_index' => 0],
            ['name' => 'Dr. Fatou Sow', 'email' => 'dr.sow@mediconsult.com', 'specialty_index' => 1],
            ['name' => 'Dr. Moussa Ndiaye', 'email' => 'dr.ndiaye@mediconsult.com', 'specialty_index' => 2],
            ['name' => 'Dr. Aissatou Ba', 'email' => 'dr.ba@mediconsult.com', 'specialty_index' => 3],
        ];

        $doctors = [];
        foreach ($doctorsData as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => Hash::make('Doctor@1234!'),
                    'role' => 'doctor',
                    'phone' => '+221 7' . rand(10, 99) . ' ' . rand(100, 999) . ' ' . rand(10, 99) . ' ' . rand(10, 99),
                ]
            );

            $specialty = $specialties[$data['specialty_index']] ?? $specialties->first();

            $doctor = Doctor::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'specialty_id' => $specialty->id,
                    'license_number' => 'MED-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT),
                    'consultation_fee' => rand(15, 50) * 1000,
                    'is_available' => true,
                ]
            );

            $doctors[] = $doctor;

            // Creneaux horaires: lundi(1) a vendredi(5) en smallint
            foreach ([1, 2, 3, 4, 5] as $day) {
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

        $this->command->info('4 medecins crees avec creneaux.');

        // 2. Patients
        $patientsData = [
            ['name' => 'Ousmane Fall', 'email' => 'ousmane.fall@gmail.com'],
            ['name' => 'Mariama Diop', 'email' => 'mariama.diop@gmail.com'],
            ['name' => 'Ibrahima Sy', 'email' => 'ibrahima.sy@gmail.com'],
            ['name' => 'Awa Niang', 'email' => 'awa.niang@gmail.com'],
            ['name' => 'Cheikh Mbaye', 'email' => 'cheikh.mbaye@gmail.com'],
            ['name' => 'Coumba Ndoye', 'email' => 'ndoye.coumba@gmail.com'],
        ];

        $patients = [];
        foreach ($patientsData as $data) {
            $patients[] = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => Hash::make('Patient@1234!'),
                    'role' => 'patient',
                    'phone' => '+221 7' . rand(10, 99) . ' ' . rand(100, 999) . ' ' . rand(10, 99) . ' ' . rand(10, 99),
                    'date_of_birth' => Carbon::now()->subYears(rand(20, 60))->subDays(rand(1, 365))->format('Y-m-d'),
                    'gender' => rand(0, 1) ? 'male' : 'female',
                    'address' => ['Dakar', 'Thies', 'Saint-Louis', 'Ziguinchor', 'Kaolack'][rand(0, 4)] . ', Senegal',
                ]
            );
        }

        $this->command->info('6 patients crees.');

        // 3. Rendez-vous
        $statuses = ['confirmed', 'pending', 'completed', 'cancelled'];
        $appointments = [];

        $appointmentsData = [
            ['patient' => 0, 'doctor' => 0, 'offset_days' => -7, 'status' => 'completed', 'reason' => 'Douleurs thoraciques recurrentes'],
            ['patient' => 1, 'doctor' => 1, 'offset_days' => -3, 'status' => 'completed', 'reason' => 'Consultation dermatologique - eruption cutanee'],
            ['patient' => 2, 'doctor' => 2, 'offset_days' => 0, 'status' => 'confirmed', 'reason' => 'Suivi post-operatoire genou'],
            ['patient' => 3, 'doctor' => 3, 'offset_days' => 1, 'status' => 'pending', 'reason' => 'Consultation pediatrique pour fievre persistante'],
            ['patient' => 4, 'doctor' => 0, 'offset_days' => 3, 'status' => 'confirmed', 'reason' => 'Bilan cardiaque annuel'],
            ['patient' => 5, 'doctor' => 1, 'offset_days' => 5, 'status' => 'pending', 'reason' => 'Acne severe - demande de traitement'],
            ['patient' => 0, 'doctor' => 2, 'offset_days' => -14, 'status' => 'cancelled', 'reason' => 'Douleurs au dos'],
            ['patient' => 1, 'doctor' => 3, 'offset_days' => 7, 'status' => 'confirmed', 'reason' => 'Vaccination enfant'],
        ];

        foreach ($appointmentsData as $data) {
            $scheduledAt = Carbon::now()->addDays($data['offset_days'])->setHour(rand(8, 16))->setMinute(rand(0, 1) * 30);

            $appointment = Appointment::create([
                'patient_id' => $patients[$data['patient']]->id,
                'doctor_id' => $doctors[$data['doctor']]->id,
                'scheduled_at' => $scheduledAt,
                'status' => $data['status'],
                'reason' => $data['reason'],
                'cancellation_reason' => $data['status'] === 'cancelled' ? 'Patient indisponible' : null,
            ]);

            $appointments[] = $appointment;
        }

        $this->command->info('8 rendez-vous crees.');

        // 4. Pre-consultations IA
        $symptoms = Symptom::all();

        if ($symptoms->isNotEmpty() && count($appointments) >= 3) {
            $preConsultationsData = [
                [
                    'appointment' => 0,
                    'patient' => 0,
                    'confidence' => 0.85,
                    'suggested_specialty' => 'Cardiologie',
                    'additional_notes' => 'Patient signale des douleurs thoraciques depuis 2 semaines, aggravees a l\'effort.',
                    'ai_recommendation' => 'ECG recommande. Consultation cardiologique prioritaire.',
                ],
                [
                    'appointment' => 2,
                    'patient' => 2,
                    'confidence' => 0.72,
                    'suggested_specialty' => 'Orthopedie',
                    'additional_notes' => 'Douleur au genou droit post-chirurgie, difficulte a marcher.',
                    'ai_recommendation' => 'Radiographie de controle. Kinesitherapie suggeree.',
                ],
                [
                    'appointment' => 3,
                    'patient' => 3,
                    'confidence' => 0.91,
                    'suggested_specialty' => 'Pediatrie',
                    'additional_notes' => 'Enfant de 4 ans avec fievre > 39C depuis 3 jours.',
                    'ai_recommendation' => 'Bilan sanguin urgent. Possible infection bacterienne.',
                ],
            ];

            foreach ($preConsultationsData as $data) {
                $pc = PreConsultation::create([
                    'appointment_id' => $appointments[$data['appointment']]->id,
                    'patient_id' => $patients[$data['patient']]->id,
                    'confidence_score' => $data['confidence'],
                    'suggested_specialty' => $data['suggested_specialty'],
                    'additional_notes' => $data['additional_notes'],
                    'ai_recommendation' => $data['ai_recommendation'],
                ]);

                // Attacher 2-4 symptomes aleatoires
                $randomSymptoms = $symptoms->random(min(rand(2, 4), $symptoms->count()));
                foreach ($randomSymptoms as $symptom) {
                    $pc->symptoms()->attach($symptom->id, [
                        'severity' => rand(1, 10),
                        'duration_days' => rand(1, 30),
                    ]);
                }
            }

            $this->command->info('3 pre-consultations IA creees avec symptomes.');
        }

        $this->command->info('Donnees de test creees avec succes!');
    }
}
