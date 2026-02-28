<?php

namespace Database\Seeders;

use App\Models\Specialty;
use App\Models\Symptom;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SymptomSeeder extends Seeder
{
    public function run(): void
    {
        // Récupérer les IDs des spécialités
        $specialties = Specialty::pluck('id', 'name');

        // ============================================
        // Catalogue de symptômes
        // ============================================
        $symptoms = [
            // Cardiovasculaires
            ['name' => 'Douleur thoracique', 'category' => 'Douleur', 'description' => 'Douleur ou pression dans la poitrine'],
            ['name' => 'Palpitations cardiaques', 'category' => 'Cardiovasculaire', 'description' => 'Battements de cœur irréguliers ou rapides'],
            ['name' => 'Essoufflement', 'category' => 'Respiratoire', 'description' => 'Difficulté à respirer, manque de souffle'],
            ['name' => 'Gonflement des jambes', 'category' => 'Cardiovasculaire', 'description' => 'Œdème des membres inférieurs'],

            // Respiratoires
            ['name' => 'Toux persistante', 'category' => 'Respiratoire', 'description' => 'Toux qui dure plus de 3 semaines'],
            ['name' => 'Sifflement respiratoire', 'category' => 'Respiratoire', 'description' => 'Bruit sifflant lors de la respiration'],
            ['name' => 'Crachats de sang', 'category' => 'Respiratoire', 'description' => 'Hémoptysie'],

            // Neurologiques
            ['name' => 'Maux de tête sévères', 'category' => 'Neurologique', 'description' => 'Céphalées intenses et fréquentes'],
            ['name' => 'Vertiges', 'category' => 'Neurologique', 'description' => 'Sensation de rotation ou d\'instabilité'],
            ['name' => 'Engourdissement des membres', 'category' => 'Neurologique', 'description' => 'Perte de sensibilité dans les bras ou jambes'],
            ['name' => 'Troubles de la mémoire', 'category' => 'Neurologique', 'description' => 'Difficultés à mémoriser ou se souvenir'],

            // Digestifs
            ['name' => 'Douleurs abdominales', 'category' => 'Digestif', 'description' => 'Douleurs dans le ventre'],
            ['name' => 'Nausées et vomissements', 'category' => 'Digestif', 'description' => 'Envie de vomir ou vomissements'],
            ['name' => 'Diarrhée chronique', 'category' => 'Digestif', 'description' => 'Selles liquides fréquentes'],

            // Pédiatriques
            ['name' => 'Fièvre chez l\'enfant', 'category' => 'Fièvre', 'description' => 'Température élevée chez un enfant'],
            ['name' => 'Retard de croissance', 'category' => 'Pédiatrique', 'description' => 'Croissance insuffisante chez l\'enfant'],
            ['name' => 'Éruption cutanée chez l\'enfant', 'category' => 'Pédiatrique', 'description' => 'Rash ou boutons chez l\'enfant'],

            // Dermatologiques
            ['name' => 'Éruption cutanée', 'category' => 'Peau', 'description' => 'Rougeurs, boutons ou plaques sur la peau'],
            ['name' => 'Démangeaisons', 'category' => 'Peau', 'description' => 'Prurit intense'],
            ['name' => 'Chute de cheveux', 'category' => 'Peau', 'description' => 'Alopécie ou perte de cheveux anormale'],

            // Ophtalmologiques
            ['name' => 'Baisse de la vision', 'category' => 'Vision', 'description' => 'Diminution de l\'acuité visuelle'],
            ['name' => 'Douleur oculaire', 'category' => 'Vision', 'description' => 'Douleur dans ou autour de l\'œil'],
            ['name' => 'Vision double', 'category' => 'Vision', 'description' => 'Diplopie'],

            // ORL
            ['name' => 'Mal de gorge', 'category' => 'ORL', 'description' => 'Douleur ou irritation de la gorge'],
            ['name' => 'Perte d\'audition', 'category' => 'ORL', 'description' => 'Diminution de l\'ouïe'],
            ['name' => 'Saignement de nez', 'category' => 'ORL', 'description' => 'Épistaxis'],

            // Gynécologiques
            ['name' => 'Douleurs pelviennes', 'category' => 'Gynécologique', 'description' => 'Douleurs dans le bas-ventre'],
            ['name' => 'Règles irrégulières', 'category' => 'Gynécologique', 'description' => 'Cycle menstruel perturbé'],

            // Orthopédiques
            ['name' => 'Douleurs articulaires', 'category' => 'Douleur', 'description' => 'Douleurs dans les articulations'],
            ['name' => 'Douleurs dorsales', 'category' => 'Douleur', 'description' => 'Mal de dos'],
            ['name' => 'Fracture ou traumatisme', 'category' => 'Traumatisme', 'description' => 'Blessure osseuse ou musculaire'],

            // Généraux
            ['name' => 'Fatigue intense', 'category' => 'Général', 'description' => 'Épuisement persistant'],
            ['name' => 'Fièvre', 'category' => 'Fièvre', 'description' => 'Température corporelle élevée'],
            ['name' => 'Perte de poids inexpliquée', 'category' => 'Général', 'description' => 'Amaigrissement sans raison apparente'],
        ];

        // Insérer les symptômes
        foreach ($symptoms as $symptomData) {
            Symptom::create($symptomData);
        }

        // ============================================
        // Poids symptôme ↔ spécialité (coeur de l'IA)
        // ============================================
        $weights = [
            // Douleur thoracique → Cardiologie (0.90), Pneumologie (0.60), Médecine Générale (0.40)
            ['symptom' => 'Douleur thoracique', 'specialty' => 'Cardiologie', 'weight' => 0.90],
            ['symptom' => 'Douleur thoracique', 'specialty' => 'Pneumologie', 'weight' => 0.60],
            ['symptom' => 'Douleur thoracique', 'specialty' => 'Médecine Générale', 'weight' => 0.40],

            // Palpitations → Cardiologie (0.95)
            ['symptom' => 'Palpitations cardiaques', 'specialty' => 'Cardiologie', 'weight' => 0.95],
            ['symptom' => 'Palpitations cardiaques', 'specialty' => 'Médecine Générale', 'weight' => 0.30],

            // Essoufflement → Cardiologie (0.75), Pneumologie (0.85)
            ['symptom' => 'Essoufflement', 'specialty' => 'Cardiologie', 'weight' => 0.75],
            ['symptom' => 'Essoufflement', 'specialty' => 'Pneumologie', 'weight' => 0.85],

            // Gonflement des jambes → Cardiologie (0.80)
            ['symptom' => 'Gonflement des jambes', 'specialty' => 'Cardiologie', 'weight' => 0.80],
            ['symptom' => 'Gonflement des jambes', 'specialty' => 'Médecine Générale', 'weight' => 0.40],

            // Toux persistante → Pneumologie (0.90), ORL (0.50)
            ['symptom' => 'Toux persistante', 'specialty' => 'Pneumologie', 'weight' => 0.90],
            ['symptom' => 'Toux persistante', 'specialty' => 'ORL', 'weight' => 0.50],
            ['symptom' => 'Toux persistante', 'specialty' => 'Médecine Générale', 'weight' => 0.40],

            // Sifflement respiratoire → Pneumologie (0.95)
            ['symptom' => 'Sifflement respiratoire', 'specialty' => 'Pneumologie', 'weight' => 0.95],

            // Crachats de sang → Pneumologie (0.90)
            ['symptom' => 'Crachats de sang', 'specialty' => 'Pneumologie', 'weight' => 0.90],

            // Maux de tête → Neurologie (0.80), Ophtalmologie (0.40), Médecine Générale (0.50)
            ['symptom' => 'Maux de tête sévères', 'specialty' => 'Neurologie', 'weight' => 0.80],
            ['symptom' => 'Maux de tête sévères', 'specialty' => 'Ophtalmologie', 'weight' => 0.40],
            ['symptom' => 'Maux de tête sévères', 'specialty' => 'Médecine Générale', 'weight' => 0.50],

            // Vertiges → Neurologie (0.75), ORL (0.70)
            ['symptom' => 'Vertiges', 'specialty' => 'Neurologie', 'weight' => 0.75],
            ['symptom' => 'Vertiges', 'specialty' => 'ORL', 'weight' => 0.70],

            // Engourdissement → Neurologie (0.90)
            ['symptom' => 'Engourdissement des membres', 'specialty' => 'Neurologie', 'weight' => 0.90],

            // Troubles mémoire → Neurologie (0.85)
            ['symptom' => 'Troubles de la mémoire', 'specialty' => 'Neurologie', 'weight' => 0.85],

            // Douleurs abdominales → Médecine Générale (0.60), Urologie (0.40)
            ['symptom' => 'Douleurs abdominales', 'specialty' => 'Médecine Générale', 'weight' => 0.60],
            ['symptom' => 'Douleurs abdominales', 'specialty' => 'Urologie', 'weight' => 0.40],

            // Nausées → Médecine Générale (0.60), Gynécologie (0.40)
            ['symptom' => 'Nausées et vomissements', 'specialty' => 'Médecine Générale', 'weight' => 0.60],
            ['symptom' => 'Nausées et vomissements', 'specialty' => 'Gynécologie', 'weight' => 0.40],

            // Diarrhée → Médecine Générale (0.70)
            ['symptom' => 'Diarrhée chronique', 'specialty' => 'Médecine Générale', 'weight' => 0.70],

            // Fièvre enfant → Pédiatrie (0.95)
            ['symptom' => 'Fièvre chez l\'enfant', 'specialty' => 'Pédiatrie', 'weight' => 0.95],
            ['symptom' => 'Fièvre chez l\'enfant', 'specialty' => 'Médecine Générale', 'weight' => 0.30],

            // Retard croissance → Pédiatrie (0.95)
            ['symptom' => 'Retard de croissance', 'specialty' => 'Pédiatrie', 'weight' => 0.95],

            // Éruption enfant → Pédiatrie (0.80), Dermatologie (0.70)
            ['symptom' => 'Éruption cutanée chez l\'enfant', 'specialty' => 'Pédiatrie', 'weight' => 0.80],
            ['symptom' => 'Éruption cutanée chez l\'enfant', 'specialty' => 'Dermatologie', 'weight' => 0.70],

            // Éruption cutanée → Dermatologie (0.95)
            ['symptom' => 'Éruption cutanée', 'specialty' => 'Dermatologie', 'weight' => 0.95],

            // Démangeaisons → Dermatologie (0.90)
            ['symptom' => 'Démangeaisons', 'specialty' => 'Dermatologie', 'weight' => 0.90],

            // Chute cheveux → Dermatologie (0.85)
            ['symptom' => 'Chute de cheveux', 'specialty' => 'Dermatologie', 'weight' => 0.85],

            // Baisse vision → Ophtalmologie (0.95)
            ['symptom' => 'Baisse de la vision', 'specialty' => 'Ophtalmologie', 'weight' => 0.95],

            // Douleur oculaire → Ophtalmologie (0.95)
            ['symptom' => 'Douleur oculaire', 'specialty' => 'Ophtalmologie', 'weight' => 0.95],

            // Vision double → Ophtalmologie (0.85), Neurologie (0.60)
            ['symptom' => 'Vision double', 'specialty' => 'Ophtalmologie', 'weight' => 0.85],
            ['symptom' => 'Vision double', 'specialty' => 'Neurologie', 'weight' => 0.60],

            // Mal de gorge → ORL (0.90), Médecine Générale (0.50)
            ['symptom' => 'Mal de gorge', 'specialty' => 'ORL', 'weight' => 0.90],
            ['symptom' => 'Mal de gorge', 'specialty' => 'Médecine Générale', 'weight' => 0.50],

            // Perte audition → ORL (0.95)
            ['symptom' => 'Perte d\'audition', 'specialty' => 'ORL', 'weight' => 0.95],

            // Saignement nez → ORL (0.85)
            ['symptom' => 'Saignement de nez', 'specialty' => 'ORL', 'weight' => 0.85],

            // Douleurs pelviennes → Gynécologie (0.90), Urologie (0.50)
            ['symptom' => 'Douleurs pelviennes', 'specialty' => 'Gynécologie', 'weight' => 0.90],
            ['symptom' => 'Douleurs pelviennes', 'specialty' => 'Urologie', 'weight' => 0.50],

            // Règles irrégulières → Gynécologie (0.95)
            ['symptom' => 'Règles irrégulières', 'specialty' => 'Gynécologie', 'weight' => 0.95],

            // Douleurs articulaires → Orthopédie (0.90)
            ['symptom' => 'Douleurs articulaires', 'specialty' => 'Orthopédie', 'weight' => 0.90],
            ['symptom' => 'Douleurs articulaires', 'specialty' => 'Médecine Générale', 'weight' => 0.40],

            // Douleurs dorsales → Orthopédie (0.85), Médecine Générale (0.50)
            ['symptom' => 'Douleurs dorsales', 'specialty' => 'Orthopédie', 'weight' => 0.85],
            ['symptom' => 'Douleurs dorsales', 'specialty' => 'Médecine Générale', 'weight' => 0.50],

            // Fracture → Orthopédie (0.95)
            ['symptom' => 'Fracture ou traumatisme', 'specialty' => 'Orthopédie', 'weight' => 0.95],

            // Fatigue → Médecine Générale (0.70), Cardiologie (0.40)
            ['symptom' => 'Fatigue intense', 'specialty' => 'Médecine Générale', 'weight' => 0.70],
            ['symptom' => 'Fatigue intense', 'specialty' => 'Cardiologie', 'weight' => 0.40],

            // Fièvre → Médecine Générale (0.80)
            ['symptom' => 'Fièvre', 'specialty' => 'Médecine Générale', 'weight' => 0.80],

            // Perte de poids → Médecine Générale (0.70)
            ['symptom' => 'Perte de poids inexpliquée', 'specialty' => 'Médecine Générale', 'weight' => 0.70],
        ];

        // Insérer les poids
        $symptomIds = Symptom::pluck('id', 'name');

        foreach ($weights as $weight) {
            $symptomId = $symptomIds[$weight['symptom']] ?? null;
            $specialtyId = $specialties[$weight['specialty']] ?? null;

            if ($symptomId && $specialtyId) {
                DB::table('symptom_specialty')->insert([
                    'symptom_id' => $symptomId,
                    'specialty_id' => $specialtyId,
                    'weight' => $weight['weight'],
                ]);
            }
        }
    }
}
