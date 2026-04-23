<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Contribution;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        Gate::authorize('manage contributions');
        $events = Event::orderBy('date', 'desc')->get();
        return Inertia::render('Events/Index', ['events' => $events]);
    }

    public function create()
    {
        Gate::authorize('manage contributions');
        return Inertia::render('Events/Create');
    }

    public function store(Request $request)
    {
        Gate::authorize('manage contributions');
        $validated = $request->validate([
            'name' => 'required|string',
            'date' => 'required|date',
        ]);

        // Deactivate previous active event
        Event::where('is_active', true)->update(['is_active' => false]);

        // Create new event as active
        $event = Event::create([
            'name' => $validated['name'],
            'date' => $validated['date'],
            'is_active' => true,
        ]);

        // Create contribution records for all members
        $members = Member::all();
        foreach ($members as $member) {
            Contribution::create([
                'member_id' => $member->id,
                'event_id' => $event->id,
                'has_money' => false,
                'has_rice' => false,
                'status' => 'pending',
            ]);
        }

        return redirect()->route('admin.events.index')->with('success', 'Event created and set as active.');
    }

    public function edit(Event $event)
    {
        Gate::authorize('manage contributions');
        return Inertia::render('Events/Edit', ['event' => $event]);
    }

    public function update(Request $request, Event $event)
    {
        Gate::authorize('manage contributions');
        $validated = $request->validate([
            'name' => 'required|string',
            'date' => 'required|date',
            'is_active' => 'sometimes|boolean',
        ]);

        $event->update($validated);

        // If this event is being set to active, deactivate others
        if ($request->has('is_active') && $request->is_active) {
            Event::where('id', '!=', $event->id)->update(['is_active' => false]);
        }

        return redirect()->route('admin.events.index')->with('success', 'Event updated.');
    }

    public function destroy(Event $event)
    {
        Gate::authorize('manage contributions');
        $event->delete();
        return redirect()->route('admin.events.index')->with('success', 'Event deleted.');
    }

    // Optional: manual switch active event
    public function setActive(Event $event)
    {
        Gate::authorize('manage contributions');
        Event::where('is_active', true)->update(['is_active' => false]);
        $event->update(['is_active' => true]);
        return redirect()->back()->with('success', 'Active event switched.');
    }
}
