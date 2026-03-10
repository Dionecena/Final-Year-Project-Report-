<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Cree le super administrateur par defaut.
     */
    public function run(): void
    {
        // Supprimer l'ancien compte admin@mediconsult.sn s'il existe
        User::where('email', 'admin@mediconsult.sn')->delete();

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

        $this->command->info('Super Admin cree : admin@mediconsult.com / Admin@1234!');
    }
}
