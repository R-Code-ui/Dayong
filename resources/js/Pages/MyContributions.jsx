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
            <AuthenticatedLayout header={<h2 className="text-xl font-bold tracking-tight text-[#080616]">My Contributions</h2>}>
                <div className="flex min-h-[400px] items-center justify-center rounded-2xl border-2 border-dashed border-gray-100 bg-white p-12 text-center text-gray-400">
                    <p className="text-lg font-medium">{message}</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-bold tracking-tight text-[#080616]">My Contributions</h2>}
        >
            <Head title="My Contributions" />

            <div className="py-8 bg-white min-h-screen">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Welcome Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-[#080616] sm:text-3xl">
                            Welcome, <span className="text-[#2F2FE4]">{member?.name}</span>
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">Track and manage your event contributions below.</p>
                    </div>

                    {/* Filter Bar */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex flex-1 flex-wrap gap-3">
                            <div className="relative flex-1 min-w-[280px]">
                                <input
                                    type="text"
                                    placeholder="Search by event or date..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full rounded-lg border-gray-200 py-2.5 pl-4 pr-10 text-sm focus:border-[#2F2FE4] focus:ring-[#2F2FE4]/20 transition-all shadow-sm"
                                />
                            </div>

                            <select
                                value={eventFilter}
                                onChange={e => setEventFilter(e.target.value)}
                                className="rounded-lg border-gray-200 py-2.5 text-sm focus:border-[#2F2FE4] focus:ring-[#2F2FE4]/20 transition-all shadow-sm min-w-[160px]"
                            >
                                <option value="">All Events</option>
                                {eventNames.map(name => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="overflow-hidden bg-white border border-gray-100 shadow-xl shadow-gray-200/40 rounded-2xl">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-[#080616]">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-white/70">Event Details</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-white/70">Event Date</th>
                                        <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-white/70">Money (₱200)</th>
                                        <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-white/70">Rice</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-white/70">Date Given</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-white/70">Status</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-white/70">Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredContributions.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-sm text-gray-400">
                                                No contributions found matching your search.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredContributions.map(contribution => (
                                            <tr key={contribution.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-semibold text-[#1A1953]">{contribution.event?.name || '—'}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-600">
                                                        {contribution.event?.date ? new Date(contribution.event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {contribution.has_money ?
                                                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">✓</span> :
                                                        <span className="text-gray-300 text-sm">—</span>
                                                    }
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {contribution.has_rice ?
                                                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">✓</span> :
                                                        <span className="text-gray-300 text-sm">—</span>
                                                    }
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {contribution.date_given ? new Date(contribution.date_given).toLocaleDateString() : '—'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide shadow-sm ${
                                                        contribution.status === 'completed' ? 'bg-green-50 text-green-700 border border-green-100' :
                                                        contribution.status === 'partial' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                                                        'bg-red-50 text-red-700 border border-red-100'
                                                    }`}>
                                                        {contribution.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 italic max-w-xs truncate">
                                                    {contribution.notes || '—'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
