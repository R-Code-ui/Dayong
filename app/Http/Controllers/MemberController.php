<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class MemberController extends Controller
{
    public function index()
    {
        Gate::authorize('manage members');
        // Paginate: 15 members per page
        $members = Member::orderBy('name')->paginate(15);
        return Inertia::render('Members/Index', ['members' => $members]);
    }

    public function create()
    {
        Gate::authorize('manage members');
        return Inertia::render('Members/Create');
    }

    public function store(Request $request)
    {
        Gate::authorize('manage members');
        $validated = $request->validate([
            'name' => 'required|string|unique:members,name',
        ]);
        Member::create($validated);
        return redirect()->route('admin.members.index')->with('success', 'Member added.');
    }

    public function edit(Member $member)
    {
        Gate::authorize('manage members');
        return Inertia::render('Members/Edit', ['member' => $member]);
    }

    public function update(Request $request, Member $member)
    {
        Gate::authorize('manage members');
        $validated = $request->validate([
            'name' => 'required|string|unique:members,name,' . $member->id,
        ]);
        $member->update($validated);
        return redirect()->route('admin.members.index')->with('success', 'Member updated.');
    }

    public function destroy(Member $member)
    {
        Gate::authorize('manage members');
        $member->delete();
        return redirect()->route('admin.members.index')->with('success', 'Member deleted.');
    }
}
