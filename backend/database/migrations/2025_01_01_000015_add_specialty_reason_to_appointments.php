<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            // Rendre doctor_id et scheduled_at nullable (la secretaire assignera apres)
            $table->foreignId('doctor_id')->nullable()->change();
            $table->timestamp('scheduled_at')->nullable()->change();

            // Ajouter specialty_id et reason
            $table->foreignId('specialty_id')->nullable()->after('doctor_id')->constrained()->onDelete('set null');
            $table->text('reason')->nullable()->after('specialty_id');
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropForeign(['specialty_id']);
            $table->dropColumn(['specialty_id', 'reason']);
            $table->foreignId('doctor_id')->nullable(false)->change();
            $table->timestamp('scheduled_at')->nullable(false)->change();
        });
    }
};
