<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SecretarySeeder extends Seeder
{
    /**
     * Crée le compte secrétaire par défaut.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'secretaire@mediconsult.com'],
            [
                'name'      => 'Secrétaire MediConsult',
                'email'     => 'secretaire@mediconsult.com',
                'password'  => Hash::make('Secretaire@1234!'),
                'role'      => 'secretary',
                'is_active' => true,
            ]
        );

        $this->command->info('Secrétaire créée : secretaire@mediconsult.com / Secretaire@1234!');
    }
}
