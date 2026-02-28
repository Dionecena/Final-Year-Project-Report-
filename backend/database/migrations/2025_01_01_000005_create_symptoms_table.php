<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Table des symptômes
        Schema::create('symptoms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('category'); // ex: "Douleur", "Fièvre", "Respiratoire", etc.
            $table->timestamps();

            $table->index('category');
        });

        // Table pivot symptôme ↔ spécialité avec poids (coeur de l'algorithme IA)
        Schema::create('symptom_specialty', function (Blueprint $table) {
            $table->id();
            $table->foreignId('symptom_id')->constrained()->onDelete('cascade');
            $table->foreignId('specialty_id')->constrained()->onDelete('cascade');
            $table->decimal('weight', 3, 2)->default(0.50); // 0.00 à 1.00

            $table->unique(['symptom_id', 'specialty_id']);
            $table->index('specialty_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('symptom_specialty');
        Schema::dropIfExists('symptoms');
    }
};
