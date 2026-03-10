<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Carbon\Carbon;

class AuthController extends Controller
{
    /**
     * Inscription d'un nouvel utilisateur
     * POST /api/auth/register
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::min(8)],
            'role' => 'required|in:patient,doctor',
            'phone' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'phone' => $validated['phone'] ?? null,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        AuditService::log('register', 'User', $user->id, null, [
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
        ]);

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Connexion d'un utilisateur
     * POST /api/auth/login
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($validated)) {
            AuditService::logFailedLogin($validated['email']);

            return response()->json([
                'message' => 'Email ou mot de passe incorrect',
            ], 401);
        }

        $user = User::where('email', $validated['email'])->firstOrFail();

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Votre compte a ete desactive. Contactez l\'administrateur.',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        AuditService::logLogin($user->id);

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Deconnexion
     * POST /api/auth/logout
     */
    public function logout(Request $request): JsonResponse
    {
        AuditService::logLogout();

        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Deconnexion reussie',
        ]);
    }

    /**
     * Profil de l'utilisateur connecte
     * GET /api/auth/profile
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'data' => $user,
        ]);
    }

    /**
     * Mot de passe oublie - envoie un token par email
     * POST /api/auth/forgot-password
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|string|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // On retourne toujours un succes pour ne pas reveler si l'email existe
            return response()->json([
                'message' => 'Si cette adresse existe, un email de reinitialisation a ete envoye.',
            ]);
        }

        // Generer un token unique
        $token = Str::random(64);

        // Supprimer les anciens tokens pour cet email
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        // Inserer le nouveau token
        DB::table('password_reset_tokens')->insert([
            'email' => $request->email,
            'token' => Hash::make($token),
            'created_at' => Carbon::now(),
        ]);

        // Envoyer l'email avec le lien de reinitialisation
        $resetUrl = config('app.frontend_url', 'http://localhost:3000') . '/reset-password?token=' . $token . '&email=' . urlencode($request->email);

        Mail::raw(
            "Bonjour {$user->name},\n\nVous avez demande la reinitialisation de votre mot de passe MediConsult.\n\nCliquez sur ce lien pour reinitialiser votre mot de passe :\n{$resetUrl}\n\nCe lien expire dans 60 minutes.\n\nSi vous n'avez pas fait cette demande, ignorez cet email.\n\nCordialement,\nL'equipe MediConsult",
            function ($message) use ($user) {
                $message->to($user->email)
                        ->subject('MediConsult - Reinitialisation de mot de passe');
            }
        );

        AuditService::log('password_reset_request', 'User', $user->id, null, [
            'email' => $user->email,
        ]);

        return response()->json([
            'message' => 'Si cette adresse existe, un email de reinitialisation a ete envoye.',
        ]);
    }

    /**
     * Reinitialiser le mot de passe avec le token
     * POST /api/auth/reset-password
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|string|email',
            'token' => 'required|string',
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$record) {
            return response()->json([
                'message' => 'Token invalide ou expire.',
            ], 400);
        }

        // Verifier que le token n'a pas expire (60 minutes)
        if (Carbon::parse($record->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json([
                'message' => 'Token expire. Veuillez refaire une demande.',
            ], 400);
        }

        // Verifier le token hashe
        if (!Hash::check($request->token, $record->token)) {
            return response()->json([
                'message' => 'Token invalide ou expire.',
            ], 400);
        }

        // Mettre a jour le mot de passe
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur non trouve.',
            ], 404);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        // Supprimer le token utilise
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        // Revoquer tous les tokens existants
        $user->tokens()->delete();

        AuditService::log('password_reset', 'User', $user->id, null, [
            'email' => $user->email,
        ]);

        return response()->json([
            'message' => 'Mot de passe reinitialise avec succes. Vous pouvez vous connecter.',
        ]);
    }

    /**
     * Modifier le profil de l'utilisateur connecte
     * PUT /api/auth/profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'current_password' => 'required_with:new_password|string',
            'new_password' => ['nullable', 'confirmed', Password::min(8)],
        ]);

        // Verifier le mot de passe actuel si changement de MDP
        if (isset($validated['current_password'])) {
            if (!Hash::check($validated['current_password'], $user->password)) {
                return response()->json([
                    'message' => 'Le mot de passe actuel est incorrect.',
                    'errors' => ['current_password' => ['Le mot de passe actuel est incorrect.']],
                ], 422);
            }
        }

        $oldData = $user->only(['name', 'email', 'phone']);

        // Mettre a jour les champs
        if (isset($validated['name'])) $user->name = $validated['name'];
        if (isset($validated['email'])) $user->email = $validated['email'];
        if (array_key_exists('phone', $validated)) $user->phone = $validated['phone'];
        if (isset($validated['new_password'])) {
            $user->password = Hash::make($validated['new_password']);
        }

        $user->save();

        AuditService::log('profile_update', 'User', $user->id, $oldData, $user->only(['name', 'email', 'phone']));

        return response()->json([
            'message' => 'Profil mis a jour avec succes.',
            'data' => $user,
        ]);
    }
}
