<?php

/**
 * DEPRECATED: This migration has been superseded by
 * 2026_03_10_000001_create_notifications_table.php
 *
 * This file is intentionally left as a no-op to avoid
 * duplicate table creation conflicts.
 *
 * @see 2026_03_10_000001_create_notifications_table.php
 */

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        // No-op: notifications table is now created by 2026_03_10_000001
    }

    public function down(): void
    {
        // No-op
    }
};
