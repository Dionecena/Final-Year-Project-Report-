<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('specialty_id')->constrained()->onDelete('restrict');
            $table->text('bio')->nullable();
            $table->string('photo')->nullable();
            $table->string('license_number')->nullable();
            $table->timestamps();

            $table->unique('user_id'); // Un utilisateur ne peut être médecin qu'une fois
            $table->index('specialty_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
