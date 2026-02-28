<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['patient', 'doctor', 'secretary', 'admin'])->default('patient');
            $table->string('phone')->nullable();
            $table->boolean('is_active')->default(true);
            $table->rememberToken();
            $table->timestamps();

            // Index pour les recherches fréquentes
            $table->index('role');
            $table->index('is_active');
        });
        // Note: personal_access_tokens est créée par Laravel Sanctum automatiquement
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
