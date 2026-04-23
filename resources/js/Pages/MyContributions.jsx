import { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function MyContributions({ contributions, member, message }) {
    const [search, setSearch] = useState('');
    const [eventFilter, setEventFilter] = useState('');

    const eventNames = useMemo(() => {
        const names = contributions.map(c => c.event?.name).filter(Boolean);
        return [...new Set(names)];
    }, [contributions]);

    const filteredContributions = useMemo(() => {
        let result = [...contributions];
        if (search) {
            result = result.filter(c =>
                c.event?.name.toLowerCase().includes(search.toLowerCase()) ||
                c.event?.date?.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (eventFilter) {
            result = result.filter(c => c.event?.name === eventFilter);
        }
        return result;
    }, [contributions, search, eventFilter]);

    if (message) {
        return (
            <AuthenticatedLayout header={<h2>My Contributions</h2>}>
                <div className="p-6 text-center text-gray-500">{message}</div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">My Contributions</h2>}
        >
            <Head title="My Contributions" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <p className="text-lg font-medium text-gray-900">Welcome, {member?.name}</p>
                    </div>

                    <div className="mb-6 flex flex-wrap gap-4">
                        <input
                            type="text"
                            placeholder="Search by event name or date..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="rounded border px-3 py-1"
                        />
                        <select
                            value={eventFilter}
                            onChange={e => setEventFilter(e.target.value)}
                            className="rounded border px-3 py-1"
                        >
                            <option value="">All Events</option>
                            {eventNames.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="overflow-x-auto bg-white shadow rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left">Event Name</th>
                                    <th className="px-4 py-2 text-left">Event Date</th>
                                    <th className="px-4 py-2 text-center">Money (₱200)</th>
                                    <th className="px-4 py-2 text-center">Rice</th>
                                    <th className="px-4 py-2 text-left">Date Given</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2 text-left">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredContributions.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                                            No contributions found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredContributions.map(contribution => (
                                        <tr key={contribution.id}>
                                            <td className="px-4 py-2">{contribution.event?.name || '—'}</td>
                                            <td className="px-4 py-2">
                                                {contribution.event?.date ? new Date(contribution.event.date).toLocaleDateString() : '—'}
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                {contribution.has_money ? '✓' : '—'}
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                {contribution.has_rice ? '✓' : '—'}
                                            </td>
                                            <td className="px-4 py-2">
                                                {contribution.date_given ? new Date(contribution.date_given).toLocaleDateString() : '—'}
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className={`capitalize ${
                                                    contribution.status === 'completed' ? 'text-green-600' :
                                                    contribution.status === 'partial' ? 'text-yellow-600' :
                                                    'text-red-600'
                                                }`}>
                                                    {contribution.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2">{contribution.notes || '—'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
