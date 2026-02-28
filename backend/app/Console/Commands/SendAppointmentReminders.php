<?php

namespace App\Console\Commands;

use App\Models\Appointment;
use App\Notifications\AppointmentReminderNotification;
use Illuminate\Console\Command;

class SendAppointmentReminders extends Command
{
    protected $signature = 'appointments:send-reminders';
    protected $description = 'Envoyer les rappels de rendez-vous pour demain';

    public function handle(): void
    {
        $tomorrow = now()->addDay()->startOfDay();
        $tomorrowEnd = now()->addDay()->endOfDay();

        $appointments = Appointment::with(['patient', 'doctor.user', 'doctor.specialty'])
            ->where('status', 'confirmed')
            ->whereBetween('scheduled_at', [$tomorrow, $tomorrowEnd])
            ->get();

        $count = 0;
        foreach ($appointments as $appointment) {
            $appointment->patient->notify(new AppointmentReminderNotification($appointment));
            $count++;
        }

        $this->info("✅ {$count} rappel(s) envoyé(s)");
    }
}
