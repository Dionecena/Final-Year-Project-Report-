<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pre_consultations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->json('symptoms_selected'); // IDs des symptômes sélectionnés (chiffré)
            $table->foreignId('suggested_specialty_id')->nullable()->constrained('specialties')->onDelete('set null');
            $table->decimal('confidence_score', 5, 2)->nullable(); // Score de confiance 0-100
            $table->text('additional_notes')->nullable(); // Notes supplémentaires du patient
            $table->timestamps();

            $table->index('patient_id');
            $table->index('suggested_specialty_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pre_consultations');
    }
};
