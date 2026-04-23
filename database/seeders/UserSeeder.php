<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Member;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Ensure roles exist (creates them if missing)
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $memberRole = Role::firstOrCreate(['name' => 'member', 'guard_name' => 'web']);

        // ========== ADMINS ==========
        $admins = [
            ['email' => 'admin@gmail.com', 'name' => 'Admin User', 'password' => 'admin123'],
            ['email' => 'kalli@gmail.com', 'name' => 'Kalli', 'password' => 'kalli123'],
            ['email' => 'nanay@gmail.com', 'name' => 'Nanay', 'password' => 'nanay123'],
        ];

        foreach ($admins as $admin) {
            $user = User::firstOrCreate(
                ['email' => $admin['email']],
                [
                    'name' => $admin['name'],
                    'password' => bcrypt($admin['password']),
                ]
            );
            $user->assignRole($adminRole);
        }

        // ========== MEMBERS (10 existing members) ==========
        $members = Member::all();

        foreach ($members as $member) {
            $email = strtolower(str_replace(' ', '.', $member->name)) . '@dayong.com';
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $member->name,
                    'password' => bcrypt('password'),
                ]
            );
            $user->assignRole($memberRole);

            // Link member to user
            $member->user_id = $user->id;
            $member->save();
        }
    }
}
