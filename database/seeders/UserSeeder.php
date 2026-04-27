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
        // Ensure roles exist
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

        // ========== MEMBERS ==========
        // Get all members (already seeded by MemberSeeder)
        $members = Member::all();

        foreach ($members as $member) {
            // Create safe email: lowercase, replace spaces with dots, remove special characters
            $emailBase = strtolower(str_replace(' ', '.', $member->name));
            $emailBase = preg_replace('/[^a-z0-9.]/', '', $emailBase); // remove any non-alphanumeric except dot
            $email = $emailBase . '@dayong.com';

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
