<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PreConsultation;
use App\Services\AuditService;
use App\Services\SpecialtySuggestionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PreConsultationController extends Controller
{
    public function __construct(
        private SpecialtySuggestionService $suggestionService
    ) {}

    /**
     * Soumettre un questionnaire de préconsultation
     * POST /api/pre-consultations
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'symptoms_selected' => 'required|array|min:1',
            'symptoms_selected.*' => 'integer|exists:symptoms,id',
            'additional_notes' => 'nullable|string|max:1000',
        ]);

        $patient = $request->user();

        // Calculer la meilleure suggestion
        $bestSuggestion = $this->suggestionService->getBestSuggestion(
            $validated['symptoms_selected']
        );

        $preConsultation = PreConsultation::create([
            'patient_id' => $patient->id,
            'symptoms_selected' => $validated['symptoms_selected'],
            'suggested_specialty_id' => $bestSuggestion['specialty_id'] ?? null,
            'confidence_score' => $bestSuggestion['confidence_score'] ?? null,
            'additional_notes' => $validated['additional_notes'] ?? null,
        ]);

        $preConsultation->load('suggestedSpecialty');

        AuditService::log('create', 'PreConsultation', $preConsultation->id, null, [
            'symptoms_count' => count($validated['symptoms_selected']),
            'suggested_specialty_id' => $preConsultation->suggested_specialty_id,
        ]);

        return response()->json([
            'success' => true,
            'data' => $preConsultation,
            'message' => 'Préconsultation enregistrée avec succès',
        ], 201);
    }

    /**
     * Obtenir les suggestions de spécialités pour des symptômes donnés
     * POST /api/pre-consultations/suggest
     */
    public function suggest(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'symptoms_selected' => 'required|array|min:1',
            'symptoms_selected.*' => 'integer|exists:symptoms,id',
        ]);

        $suggestions = $this->suggestionService->suggest(
            $validated['symptoms_selected'],
            topN: 3
        );

        return response()->json([
            'success' => true,
            'data' => $suggestions,
        ]);
    }

    /**
     * Historique des préconsultations du patient connecté
     * GET /api/pre-consultations
     */
    public function index(Request $request): JsonResponse
    {
        $patient = $request->user();

        $preConsultations = PreConsultation::where('patient_id', $patient->id)
            ->with('suggestedSpecialty')
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $preConsultations,
        ]);
    }

    /**
     * Détail d'une préconsultation
     * GET /api/pre-consultations/{id}
     */
    public function show(Request $request, PreConsultation $preConsultation): JsonResponse
    {
        // Seul le patient propriétaire ou un admin peut voir
        $user = $request->user();
        if (!$user->isAdmin() && $user->id !== $preConsultation->patient_id) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $preConsultation->load(['suggestedSpecialty', 'appointment.doctor.user']);

        AuditService::log('view', 'PreConsultation', $preConsultation->id);

        return response()->json([
            'success' => true,
            'data' => $preConsultation,
        ]);
    }
}
