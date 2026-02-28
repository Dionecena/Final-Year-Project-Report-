<?php

namespace App\Services;

use App\Models\Specialty;
use Illuminate\Support\Facades\DB;

/**
 * Service de suggestion de spécialité médicale
 * 
 * Algorithme de scoring basé sur les poids symptôme-spécialité.
 * 
 * Formule : Score(spécialité S) = Σ(poids(symptôme i, S)) / nombre_symptômes
 * 
 * Exemple :
 * - Patient sélectionne : douleur_thoracique (id:1) + essoufflement (id:2)
 * - Score Cardiologie = (0.90 + 0.85) / 2 = 0.875 → 87.5%
 * - Score Pneumologie = (0.60 + 0.90) / 2 = 0.750 → 75.0%
 * - Suggestion : Cardiologie (87.5% de correspondance)
 */
class SpecialtySuggestionService
{
    /**
     * Calculer les scores de correspondance pour chaque spécialité
     * basé sur les symptômes sélectionnés par le patient.
     *
     * @param array $symptomIds IDs des symptômes sélectionnés
     * @param int $topN Nombre de suggestions à retourner
     * @return array [['specialty' => Specialty, 'score' => float, 'percentage' => int], ...]
     */
    public function suggest(array $symptomIds, int $topN = 3): array
    {
        if (empty($symptomIds)) {
            return [];
        }

        $numberOfSymptoms = count($symptomIds);

        // Requête : somme des poids par spécialité pour les symptômes sélectionnés
        $scores = DB::table('symptom_specialty')
            ->select(
                'specialty_id',
                DB::raw('SUM(weight) as total_weight'),
                DB::raw('COUNT(*) as matched_symptoms')
            )
            ->whereIn('symptom_id', $symptomIds)
            ->groupBy('specialty_id')
            ->orderByDesc('total_weight')
            ->limit($topN)
            ->get();

        $results = [];

        foreach ($scores as $score) {
            $specialty = Specialty::find($score->specialty_id);
            if (!$specialty) continue;

            // Score normalisé : somme des poids / nombre de symptômes sélectionnés
            $normalizedScore = $score->total_weight / $numberOfSymptoms;
            
            // Limiter à 1.0 maximum
            $normalizedScore = min($normalizedScore, 1.0);

            $results[] = [
                'specialty' => $specialty,
                'score' => round($normalizedScore, 4),
                'percentage' => round($normalizedScore * 100, 1),
                'matched_symptoms' => $score->matched_symptoms,
                'total_symptoms_selected' => $numberOfSymptoms,
            ];
        }

        // Trier par score décroissant
        usort($results, function ($a, $b) {
            return $b['score'] <=> $a['score'];
        });

        return $results;
    }

    /**
     * Obtenir la meilleure suggestion (spécialité avec le score le plus élevé)
     *
     * @param array $symptomIds
     * @return array|null ['specialty_id' => int, 'confidence_score' => float]
     */
    public function getBestSuggestion(array $symptomIds): ?array
    {
        $suggestions = $this->suggest($symptomIds, 1);

        if (empty($suggestions)) {
            return null;
        }

        $best = $suggestions[0];

        return [
            'specialty_id' => $best['specialty']->id,
            'confidence_score' => $best['percentage'],
        ];
    }
}
