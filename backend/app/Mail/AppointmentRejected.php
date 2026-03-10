<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentRejected extends Mailable
{
    use Queueable, SerializesModels;

    public Appointment $appointment;
    public string $reason;

    public function __construct(Appointment $appointment, string $reason)
    {
        $this->appointment = $appointment;
        $this->reason = $reason;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'MediConsult - Votre rendez-vous a ete refuse',
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'emails.appointment-rejected',
        );
    }
}
