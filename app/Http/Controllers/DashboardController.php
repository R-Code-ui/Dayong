<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Member;
use App\Models\Contribution;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        Gate::authorize('manage contributions');

        $activeEvent = Event::where('is_active', true)->first();
        $totalMembers = Member::count();

        $stats = [
            'total_members' => $totalMembers,
            'completed' => 0,
            'partial' => 0,
            'pending' => 0,
            'total_money' => 0,
        ];

        if ($activeEvent) {
            $contributions = Contribution::where('event_id', $activeEvent->id)->get();
            $stats['completed'] = $contributions->where('status', 'completed')->count();
            $stats['partial'] = $contributions->where('status', 'partial')->count();
            $stats['pending'] = $contributions->where('status', 'pending')->count();
            $stats['total_money'] = $contributions->where('has_money', true)->count() * 200;
            $stats['active_event_name'] = $activeEvent->name;
        } else {
            $stats['active_event_name'] = 'No active event';
        }

        return Inertia::render('Dashboard/Index', ['stats' => $stats]);
    }
}
