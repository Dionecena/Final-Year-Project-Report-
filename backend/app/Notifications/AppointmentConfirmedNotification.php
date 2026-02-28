<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AppointmentConfirmedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private Appointment $appointment
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $appointment = $this->appointment;
        $doctor = $appointment->doctor->user;
        $specialty = $appointment->doctor->specialty;
        $scheduledAt = \Carbon\Carbon::parse($appointment->scheduled_at)
            ->locale('fr')
            ->isoFormat('dddd D MMMM YYYY [à] HH[h]mm');

        return (new MailMessage)
            ->subject('✅ Votre rendez-vous est confirmé — MediConsult')
            ->greeting("Bonjour {$notifiable->name},")
            ->line("Votre rendez-vous médical a été **confirmé**.")
            ->line("**Médecin :** Dr. {$doctor->name}")
            ->line("**Spécialité :** {$specialty->name}")
            ->line("**Date et heure :** {$scheduledAt}")
            ->action('Voir mes rendez-vous', url('/appointments'))
            ->line("En cas d'empêchement, merci d'annuler votre rendez-vous au moins 24h à l'avance.")
            ->salutation("L'équipe MediConsult");
    }
}
