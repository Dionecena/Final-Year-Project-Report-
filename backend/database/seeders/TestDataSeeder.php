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

        // ============================================
        // MEDECINS (4 doctors with users)
        // ============================================
        $doctors = [
            [
                'user' => [
                    'name' => 'Dr. Abdoulaye Diallo',
                    'email' => 'dr.diallo@mediconsult.com',
                    'password' => Hash::make('Doctor@1234!'),
                    'role' => 'doctor',
                ],
                'doctor' => [
                    'specialty_name' => 'Cardiologie',
                    'bio' => 'Cardiologue experimentee avec 15 ans de pratique. Specialiste en insuffisance cardiaque et hypertension.',
                    'license_number' => 'MED-' . rand(1000, 9999),
                ],
            ],
            [
                'user' => [
                    'name' => 'Dr. Fatou Sow',
                    'email' => 'dr.sow@mediconsult.com',
                    'password' => Hash::make('Doctor@1234!'),
                    'role' => 'doctor',
                ],
                'doctor' => [
                    'specialty_name' => 'Dermatologie',
                    'bio' => 'Dermatologue specialisee dans les maladies tropicales de la peau et la cosmetologie.',
                    'license_number' => 'MED-' . rand(1000, 9999),
                ],
            ],
            [
                'user' => [
                    'name' => 'Dr. Moussa Ndiaye',
                    'email' => 'dr.ndiaye@mediconsult.com',
                    'password' => Hash::make('Doctor@1234!'),
                    'role' => 'doctor',
                ],
                'doctor' => [
                    'specialty_name' => 'Pediatrie',
                    'bio' => 'Pediatre dedie a la sante infantile. Expert en vaccination et suivi de croissance.',
                    'license_number' => 'MED-' . rand(1000, 9999),
                ],
            ],
            [
                'user' => [
                    'name' => 'Dr. Aminata Ba',
                    'email' => 'dr.ba@mediconsult.com',
                    'password' => Hash::make('Doctor@1234!'),
                    'role' => 'doctor',
                ],
                'doctor' => [
                    'specialty_name' => 'Medecine Generale',
                    'bio' => 'Medecin generaliste avec une approche holistique. Consultations generales et bilans de sante.',
                    'license_number' => 'MED-' . rand(1000, 9999),
                ],
            ],
        ];

        $createdDoctors = [];
        foreach ($doctors as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['user']['email']],
                $data['user']
            );

            $specialty = Specialty::where('name', $data['doctor']['specialty_name'])->first();

            $doctor = Doctor::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'specialty_id' => $specialty ? $specialty->id : 1,
                    'bio' => $data['doctor']['bio'],
                    'license_number' => $data['doctor']['license_number'],
                ]
            );

            $createdDoctors[] = $doctor;
        }

        $this->command->info('4 medecins crees');

        // ============================================
        // PLANNING MEDECINS (schedules)
        // ============================================
        foreach ($createdDoctors as $doctor) {
            // Lundi(1) a Vendredi(5)
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

        $this->command->info('Planning medecins cree (lun-ven 8h-17h)');

        // ============================================
        // PATIENTS (6 patients)
        // ============================================
        $patients = [
            ['name' => 'Ousmane Fall', 'email' => 'ousmane.fall@gmail.com'],
            ['name' => 'Mariama Diop', 'email' => 'mariama.diop@gmail.com'],
            ['name' => 'Ibrahima Sy', 'email' => 'ibrahima.sy@gmail.com'],
            ['name' => 'Awa Niang', 'email' => 'awa.niang@gmail.com'],
            ['name' => 'Cheikh Mbaye', 'email' => 'cheikh.mbaye@gmail.com'],
            ['name' => 'Coumba Ndoye', 'email' => 'ndoye.coumba@gmail.com'],
        ];

        $createdPatients = [];
        foreach ($patients as $patientData) {
            $patient = User::firstOrCreate(
                ['email' => $patientData['email']],
                [
                    'name' => $patientData['name'],
                    'email' => $patientData['email'],
                    'password' => Hash::make('Patient@1234!'),
                    'role' => 'patient',
                ]
            );
            $createdPatients[] = $patient;
        }

        $this->command->info('6 patients crees');

        // ============================================
        // PRE-CONSULTATIONS IA (3 pre-consultations)
        // ============================================
        $cardiology = Specialty::where('name', 'Cardiologie')->first();
        $dermatology = Specialty::where('name', 'Dermatologie')->first();
        $pediatry = Specialty::where('name', 'Pediatrie')->first();

        $preConsultations = [];

        $preConsultations[] = PreConsultation::create([
            'patient_id' => $createdPatients[0]->id,
            'symptoms_selected' => json_encode([1, 3, 5]),
            'suggested_specialty_id' => $cardiology ? $cardiology->id : null,
            'confidence_score' => 87.50,
            'additional_notes' => 'Douleurs thoraciques depuis 3 jours, essoufflement a l\'effort.',
        ]);

        $preConsultations[] = PreConsultation::create([
            'patient_id' => $createdPatients[1]->id,
            'symptoms_selected' => json_encode([7, 9]),
            'suggested_specialty_id' => $dermatology ? $dermatology->id : null,
            'confidence_score' => 92.30,
            'additional_notes' => 'Eruptions cutanees recurrentes sur les bras et le visage.',
        ]);

        $preConsultations[] = PreConsultation::create([
            'patient_id' => $createdPatients[2]->id,
            'symptoms_selected' => json_encode([2, 4, 8]),
            'suggested_specialty_id' => $pediatry ? $pediatry->id : null,
            'confidence_score' => 78.00,
            'additional_notes' => 'Fievre persistante chez un enfant de 5 ans, toux seche.',
        ]);

        $this->command->info('3 pre-consultations IA creees');

        // ============================================
        // RENDEZ-VOUS (8 appointments)
        // ============================================
        $now = Carbon::now();

        // RDV passes
        Appointment::create([
            'patient_id' => $createdPatients[0]->id,
            'doctor_id' => $createdDoctors[0]->id,
            'pre_consultation_id' => $preConsultations[0]->id,
            'scheduled_at' => $now->copy()->subDays(5)->setHour(9)->setMinute(0),
            'status' => 'completed',
            'notes' => 'Consultation initiale. ECG normal. Suivi recommande.',
        ]);

        Appointment::create([
            'patient_id' => $createdPatients[1]->id,
            'doctor_id' => $createdDoctors[1]->id,
            'pre_consultation_id' => $preConsultations[1]->id,
            'scheduled_at' => $now->copy()->subDays(3)->setHour(10)->setMinute(30),
            'status' => 'completed',
            'notes' => 'Diagnostic: eczema atopique. Prescription de creme corticoide.',
        ]);

        // RDV aujourd'hui
        Appointment::create([
            'patient_id' => $createdPatients[2]->id,
            'doctor_id' => $createdDoctors[2]->id,
            'pre_consultation_id' => $preConsultations[2]->id,
            'scheduled_at' => $now->copy()->setHour(14)->setMinute(0),
            'status' => 'confirmed',
            'notes' => null,
        ]);

        Appointment::create([
            'patient_id' => $createdPatients[3]->id,
            'doctor_id' => $createdDoctors[3]->id,
            'scheduled_at' => $now->copy()->setHour(16)->setMinute(0),
            'status' => 'pending',
            'notes' => null,
        ]);

        // RDV futurs
        Appointment::create([
            'patient_id' => $createdPatients[4]->id,
            'doctor_id' => $createdDoctors[0]->id,
            'scheduled_at' => $now->copy()->addDays(2)->setHour(9)->setMinute(30),
            'status' => 'confirmed',
            'notes' => null,
        ]);

        Appointment::create([
            'patient_id' => $createdPatients[5]->id,
            'doctor_id' => $createdDoctors[1]->id,
            'scheduled_at' => $now->copy()->addDays(3)->setHour(11)->setMinute(0),
            'status' => 'pending',
            'notes' => null,
        ]);

        Appointment::create([
            'patient_id' => $createdPatients[0]->id,
            'doctor_id' => $createdDoctors[2]->id,
            'scheduled_at' => $now->copy()->addDays(7)->setHour(15)->setMinute(0),
            'status' => 'confirmed',
            'notes' => null,
        ]);

        // RDV annule
        Appointment::create([
            'patient_id' => $createdPatients[3]->id,
            'doctor_id' => $createdDoctors[0]->id,
            'scheduled_at' => $now->copy()->subDays(1)->setHour(11)->setMinute(0),
            'status' => 'cancelled',
            'cancellation_reason' => 'Patient indisponible - reportera le rendez-vous.',
        ]);

        $this->command->info('8 rendez-vous crees');
        $this->command->info('Donnees de test generees avec succes !');
    }
}
