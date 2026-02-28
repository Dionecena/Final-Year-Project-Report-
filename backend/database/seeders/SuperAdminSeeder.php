<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Crée le super administrateur par défaut.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@mediconsult.com'],
            [
                'name'      => 'Super Admin',
                'email'     => 'admin@mediconsult.com',
                'password'  => Hash::make('Admin@1234!'),
                'role'      => 'admin',
                'is_active' => true,
            ]
        );

        $this->command->info('✅ Super Admin créé : admin@mediconsult.com / Admin@1234!');
    }
}
