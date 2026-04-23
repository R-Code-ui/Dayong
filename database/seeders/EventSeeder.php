<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\Contribution;
use App\Models\Member;

class EventSeeder extends Seeder
{
    public function run()
    {
        $event = Event::create([
            'name' => 'First Burial - January 2025',
            'date' => '2025-01-15',
            'is_active' => true,
        ]);

        foreach (Member::all() as $member) {
            Contribution::create([
                'member_id' => $member->id,
                'event_id' => $event->id,
                'has_money' => false,
                'has_rice' => false,
                'status' => 'pending',
            ]);
        }
    }
}
