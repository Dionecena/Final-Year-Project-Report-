<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware de sécurité — Ajoute les headers HTTP de sécurité
 * Protection contre XSS, clickjacking, MIME sniffing, etc.
 */
class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Empêcher le clickjacking
        $response->headers->set('X-Frame-Options', 'DENY');

        // Empêcher le MIME sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Protection XSS pour les anciens navigateurs
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Forcer HTTPS (HSTS) — 1 an
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

        // Content Security Policy
        $response->headers->set('Content-Security-Policy',
            "default-src 'self'; " .
            "script-src 'self' 'unsafe-inline'; " .
            "style-src 'self' 'unsafe-inline'; " .
            "img-src 'self' data: https:; " .
            "font-src 'self'; " .
            "connect-src 'self'"
        );

        // Referrer Policy
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Permissions Policy
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        return $response;
    }
}
