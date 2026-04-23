<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Contribution;
use Illuminate\Support\Facades\Gate;

class ExportController extends Controller
{
    public function csv()
    {
        Gate::authorize('view reports');

        $activeEvent = Event::where('is_active', true)->first();
        if (!$activeEvent) {
            return redirect()->back()->with('error', 'No active event to export.');
        }

        $contributions = Contribution::with('member')
            ->where('event_id', $activeEvent->id)
            ->get();

        $fileName = 'dayong-' . now()->format('Y-m-d') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=$fileName",
        ];

        $callback = function () use ($contributions) {
            $file = fopen('php://output', 'w');
            // Add UTF-8 BOM for Excel compatibility
            fputs($file, "\xEF\xBB\xBF");
            // Headers
            fputcsv($file, ['Member Name', 'Money (₱200)', 'Rice', 'Date Given', 'Status', 'Notes']);
            // Rows
            foreach ($contributions as $c) {
                fputcsv($file, [
                    $c->member->name,
                    $c->has_money ? 'Yes' : 'No',
                    $c->has_rice ? 'Yes' : 'No',
                    // Wrap date in quotes to prevent Excel #### (auto-fit still needed but works better)
                    $c->date_given ? '"' . $c->date_given->format('Y-m-d') . '"' : '',
                    ucfirst($c->status),
                    $c->notes ?? '',
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
