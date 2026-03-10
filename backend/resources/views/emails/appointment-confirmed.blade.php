<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rendez-vous confirme</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">MediConsult</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0;">Confirmation de rendez-vous</p>
    </div>
    <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #2d3748; margin-top: 0;">Bonjour {{ $appointment->patient->name ?? 'Patient' }},</h2>
        <p>Nous avons le plaisir de vous confirmer votre rendez-vous :</p>
        <div style="background: #f7fafc; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 0 5px 5px 0;">
            <p style="margin: 5px 0;"><strong>Date :</strong> {{ \Carbon\Carbon::parse($appointment->date)->format('d/m/Y') }}</p>
            <p style="margin: 5px 0;"><strong>Heure :</strong> {{ $appointment->time }}</p>
            @if($appointment->doctor)
            <p style="margin: 5px 0;"><strong>Medecin :</strong> Dr. {{ $appointment->doctor->name }}</p>
            @endif
            @if($appointment->specialty)
            <p style="margin: 5px 0;"><strong>Specialite :</strong> {{ $appointment->specialty->name }}</p>
            @endif
        </div>
        <p>Veuillez vous presenter 10 minutes avant l'heure prevue avec votre carte d'identite et votre carnet de sante.</p>
        <p style="color: #718096; font-size: 14px; margin-top: 30px;">Si vous souhaitez annuler ou reporter ce rendez-vous, veuillez nous contacter le plus tot possible.</p>
    </div>
    <div style="text-align: center; padding: 20px; color: #a0aec0; font-size: 12px;">
        <p>MediConsult - Plateforme de preconsultation medicale intelligente</p>
    </div>
</body>
</html>