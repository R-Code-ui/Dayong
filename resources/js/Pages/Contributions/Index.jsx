import { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ContributionsIndex({ contributions, activeEvent, message }) {
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [search, setSearch] = useState('');

    const filteredContributions = useMemo(() => {
        if (!search) return contributions;
        return contributions.filter(c =>
            c.member.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [contributions, search]);

    const toggleSelectAll = () => {
        if (selectedMembers.length === filteredContributions.length) {
            setSelectedMembers([]);
        } else {
            setSelectedMembers(filteredContributions.map(c => c.member.id));
        }
    };

    const toggleSelect = (memberId) => {
        if (selectedMembers.includes(memberId)) {
            setSelectedMembers(selectedMembers.filter(id => id !== memberId));
        } else {
            setSelectedMembers([...selectedMembers, memberId]);
        }
    };

    const bulkUpdate = (field, value) => {
        if (selectedMembers.length === 0) {
            alert('Please select at least one member.');
            return;
        }
        router.post(route('admin.contributions.bulk'), {
            member_ids: selectedMembers,
            field: field,
            value: value,
            event_id: activeEvent?.id,
        }, { preserveScroll: true });
    };

    const updateField = (contributionId, field, value) => {
        router.patch(route('admin.contributions.update', contributionId), {
            [field]: value,
        }, { preserveScroll: true });
    };

    // Helper to format date from backend to YYYY-MM-DD
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
    };

    if (message) {
        return (
            <AuthenticatedLayout header={<h2>Contributions</h2>}>
                <div className="p-6 text-center text-gray-500">{message}</div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Contributions for {activeEvent?.name}</h2>}
        >
            <Head title="Contributions" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Bulk actions */}
                    <div className="mb-4 flex flex-wrap gap-2">
                        <button
                            onClick={() => bulkUpdate('has_money', true)}
                            className="rounded bg-green-600 px-3 py-1 text-white text-sm"
                        >
                            Mark Money for Selected
                        </button>
                        <button
                            onClick={() => bulkUpdate('has_rice', true)}
                            className="rounded bg-green-600 px-3 py-1 text-white text-sm"
                        >
                            Mark Rice for Selected
                        </button>
                        <button
                            onClick={() => bulkUpdate('has_money', false)}
                            className="rounded bg-red-600 px-3 py-1 text-white text-sm"
                        >
                            Unmark Money for Selected
                        </button>
                        <button
                            onClick={() => bulkUpdate('has_rice', false)}
                            className="rounded bg-red-600 px-3 py-1 text-white text-sm"
                        >
                            Unmark Rice for Selected
                        </button>
                    </div>

                    {/* Search */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search member..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="rounded border px-3 py-1"
                        />
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto bg-white shadow rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2">
                                        <input type="checkbox" onChange={toggleSelectAll} />
                                    </th>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-center">Money (₱200)</th>
                                    <th className="px-4 py-2 text-center">Rice</th>
                                    <th className="px-4 py-2 text-left">Date Given</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2 text-left">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredContributions.map(contribution => (
                                    <tr key={contribution.id}>
                                        <td className="px-4 py-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedMembers.includes(contribution.member.id)}
                                                onChange={() => toggleSelect(contribution.member.id)}
                                            />
                                        </td>
                                        <td className="px-4 py-2 font-medium">{contribution.member.name}</td>
                                        <td className="px-4 py-2 text-center">
                                            <input
                                                type="checkbox"
                                                checked={contribution.has_money}
                                                onChange={e => updateField(contribution.id, 'has_money', e.target.checked)}
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <input
                                                type="checkbox"
                                                checked={contribution.has_rice}
                                                onChange={e => updateField(contribution.id, 'has_rice', e.target.checked)}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="date"
                                                value={formatDateForInput(contribution.date_given)}
                                                onChange={e => updateField(contribution.id, 'date_given', e.target.value)}
                                                className="border rounded px-1"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <select
                                                value={contribution.status}
                                                onChange={e => updateField(contribution.id, 'status', e.target.value)}
                                                className="border rounded px-1"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="partial">Partial</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                value={contribution.notes || ''}
                                                onChange={e => updateField(contribution.id, 'notes', e.target.value)}
                                                className="border rounded px-1 w-32"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
