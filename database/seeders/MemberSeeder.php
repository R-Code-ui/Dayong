<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Member;

class MemberSeeder extends Seeder
{
    public function run()
    {
        $names = [
            'Oliver Alampayan',
            'Agang Pajon',
            'Agang Cirilo',
            'Agang Edwin',
            'Agang Rolando',
            'Alampayan Pado',
            'Alampayan Junior Alma',
            'Alampayan Larry',
            'Alampayan Judito',
            'Aplacador Titing',
            // TODO: Add the remaining 156 names here later
        ];

        foreach ($names as $name) {
            Member::firstOrCreate(['name' => $name]);
        }
    }
}
