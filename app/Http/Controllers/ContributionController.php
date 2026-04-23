<?php

namespace App\Http\Controllers;

use App\Models\Contribution;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ContributionController extends Controller
{
    public function index()
    {
        Gate::authorize('manage contributions');
        $activeEvent = Event::where('is_active', true)->first();
        if (!$activeEvent) {
            return Inertia::render('Contributions/Index', [
                'contributions' => [],
                'activeEvent' => null,
                'message' => 'No active event. Please create an event first.'
            ]);
        }

        // Eager load 'member' AND 'updater' (for audit log)
        $contributions = Contribution::with(['member', 'updater'])
            ->where('event_id', $activeEvent->id)
            ->get();

        return Inertia::render('Contributions/Index', [
            'contributions' => $contributions,
            'activeEvent' => $activeEvent,
        ]);
    }

    public function update(Request $request, Contribution $contribution)
    {
        Gate::authorize('manage contributions');
        $data = $request->validate([
            'has_money' => 'sometimes|boolean',
            'has_rice' => 'sometimes|boolean',
            'date_given' => 'nullable|date',
            'status' => 'sometimes|in:pending,partial,completed',
            'notes' => 'nullable|string',
        ]);

        $contribution->update($data);
        $contribution->updateStatus(); // auto‑set status

        // Log who updated
        $contribution->updated_by = auth()->id();
        $contribution->save();

        return redirect()->back();
    }

    public function bulkUpdate(Request $request)
    {
        Gate::authorize('manage contributions');
        $request->validate([
            'member_ids' => 'required|array',
            'field' => 'required|in:has_money,has_rice',
            'value' => 'required|boolean',
            'event_id' => 'required|exists:events,id',
        ]);

        $contributions = Contribution::where('event_id', $request->event_id)
            ->whereIn('member_id', $request->member_ids)
            ->get();

        foreach ($contributions as $contribution) {
            $contribution->{$request->field} = $request->value;
            $contribution->updateStatus();
            $contribution->updated_by = auth()->id();
            $contribution->save();
        }

        return redirect()->back()->with('success', 'Bulk update applied.');
    }

    public function myContributions()
    {
        $user = auth()->user();
        $member = $user->member;

        if (!$member) {
            return Inertia::render('MyContributions', [
                'contributions' => [],
                'message' => 'No member profile linked. Please contact admin.'
            ]);
        }

        $contributions = Contribution::with('event')
            ->where('member_id', $member->id)
            ->orderBy('date_given', 'desc')
            ->get();

        return Inertia::render('MyContributions', [
            'contributions' => $contributions,
            'member' => $member,
        ]);
    }
}
