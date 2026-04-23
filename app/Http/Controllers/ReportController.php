<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Contribution;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Gate;

class ReportController extends Controller
{
    public function pdf()
    {
        Gate::authorize('view reports');

        $activeEvent = Event::where('is_active', true)->first();
        if (!$activeEvent) {
            return redirect()->back()->with('error', 'No active event to generate PDF.');
        }

        $contributions = Contribution::with('member')
            ->where('event_id', $activeEvent->id)
            ->get();

        $totalMoney = $contributions->where('has_money', true)->count() * 200;
        $totalRice = $contributions->where('has_rice', true)->count();

        $pdf = Pdf::loadView('pdf.dayong-report', [
            'event' => $activeEvent,
            'contributions' => $contributions,
            'totalMoney' => $totalMoney,
            'totalRice' => $totalRice,
        ]);

        // Force Unicode font support
        $pdf->setOptions([
            'defaultFont' => 'dejavu sans',
            'isRemoteEnabled' => true,
        ]);

        return $pdf->download('dayong-report-' . now()->format('Y-m-d') . '.pdf');
    }
}
