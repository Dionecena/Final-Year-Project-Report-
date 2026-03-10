<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rendez-vous refuse</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">MediConsult</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0;">Information sur votre rendez-vous</p>
    </div>
    <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #2d3748; margin-top: 0;">Bonjour {{ $appointment->patient->name ?? 'Patient' }},</h2>
        <p>Nous sommes desoles de vous informer que votre rendez-vous n'a pas pu etre confirme :</p>
        <div style="background: #fff5f5; border-left: 4px solid #fc8181; padding: 15px; margin: 20px 0; border-radius: 0 5px 5px 0;">
            <p style="margin: 5px 0;"><strong>Date demandee :</strong> {{ \Carbon\Carbon::parse($appointment->date)->format('d/m/Y') }}</p>
            <p style="margin: 5px 0;"><strong>Heure :</strong> {{ $appointment->time }}</p>
            <p style="margin: 10px 0 5px;"><strong>Motif du refus :</strong></p>
            <p style="margin: 5px 0; color: #c53030;">{{ $reason }}</p>
        </div>
        <p>Nous vous invitons a reprendre un nouveau rendez-vous en ligne sur notre plateforme.</p>
        <div style="text-align: center; margin: 25px 0;">
            <a href="{{ config('app.frontend_url', 'http://localhost:3000') }}/app/appointments/new" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reprendre un rendez-vous</a>
        </div>
        <p style="color: #718096; font-size: 14px; margin-top: 30px;">Pour toute question, n'hesitez pas a nous contacter.</p>
    </div>
    <div style="text-align: center; padding: 20px; color: #a0aec0; font-size: 12px;">
        <p>MediConsult - Plateforme de preconsultation medicale intelligente</p>
    </div>
</body>
</html>