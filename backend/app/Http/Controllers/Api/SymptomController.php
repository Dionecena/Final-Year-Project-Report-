<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Symptom;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SymptomController extends Controller
{
    /**
     * Lister tous les symptômes (groupés par catégorie)
     * GET /api/symptoms
     */
    public function index(): JsonResponse
    {
        $symptoms = Symptom::orderBy('category')->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => $symptoms,
        ]);
    }

    /**
     * Lister les catégories de symptômes
     * GET /api/symptoms/categories
     */
    public function categories(): JsonResponse
    {
        $categories = Symptom::distinct()->pluck('category')->sort()->values();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }
}
