<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Table pivot entre pre_consultations et symptoms.
     * Permet la relation many-to-many PreConsultation::symptoms().
     */
    public function up(): void
    {
        Schema::create('pre_consultation_symptom', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pre_consultation_id')->constrained('pre_consultations')->onDelete('cascade');
            $table->foreignId('symptom_id')->constrained('symptoms')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['pre_consultation_id', 'symptom_id'], 'pc_symptom_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pre_consultation_symptom');
    }
};
