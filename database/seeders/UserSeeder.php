<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Create Admin (Lola)
        $admin = User::firstOrCreate(
            ['email' => 'lola@dayong.com'],
            [
                'name' => 'Lola Admin',
                'password' => bcrypt('password'),
            ]
        );
        $admin->assignRole('admin');

        // Optional: Create a test member
        $member = User::firstOrCreate(
            ['email' => 'member@dayong.com'],
            [
                'name' => 'Test Member',
                'password' => bcrypt('password'),
            ]
        );
        $member->assignRole('member');
    }
}
