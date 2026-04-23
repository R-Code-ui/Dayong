<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Dayong Report - {{ $event->name }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
        }
        h1 { color: #333; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .summary {
            margin-top: 20px;
            padding: 10px;
            background: #f9f9f9;
        }
        .yes {
            font-weight: bold;
            color: green;
        }
        .no {
            color: #999;
        }
    </style>
</head>
<body>
    <h1>Dayong Contribution Report</h1>
    <p><strong>Event:</strong> {{ $event->name }}</p>
    <p><strong>Date:</strong> {{ $event->date->format('F d, Y') }}</p>

    <div class="summary">
        <strong>Summary:</strong><br>
        Total Members: {{ $contributions->count() }}<br>
        Total Money Collected: ₱{{ number_format($totalMoney, 2) }}<br>
        Total Rice Given: {{ $totalRice }} units<br>
        Completed: {{ $contributions->where('status', 'completed')->count() }}<br>
        Partial: {{ $contributions->where('status', 'partial')->count() }}<br>
        Pending: {{ $contributions->where('status', 'pending')->count() }}
    </div>

    <table>
        <thead>
            <tr>
                <th>Member Name</th>
                <th>Money (₱200)</th>
                <th>Rice</th>
                <th>Date Given</th>
                <th>Status</th>
                <th>Notes</th>
            </tr>
        </thead>
        <tbody>
            @foreach($contributions as $c)
            <tr>
                <td>{{ $c->member->name }}</td>
                <td class="{{ $c->has_money ? 'yes' : 'no' }}">
                    {{ $c->has_money ? 'Yes' : 'No' }}
                </td>
                <td class="{{ $c->has_rice ? 'yes' : 'no' }}">
                    {{ $c->has_rice ? 'Yes' : 'No' }}
                </td>
                <td>{{ $c->date_given ? $c->date_given->format('Y-m-d') : '' }}</td>
                <td>{{ ucfirst($c->status) }}</td>
                <td>{{ $c->notes ?? '' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
