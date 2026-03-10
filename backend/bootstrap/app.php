<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
            'role' => \App\Http\Middleware\CheckRole::class,
        ]);

        // CORS dynamique : autoriser le frontend (local + production)
        $allowedOrigins = array_filter([
            'http://localhost:3000',
            env('FRONTEND_URL'),
        ]);

        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);

        // Configuration CORS via le middleware HandleCors de Laravel
        $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);

        // Ajouter les headers de securite sur toutes les reponses
        $middleware->append(\App\Http\Middleware\SecurityHeaders::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
