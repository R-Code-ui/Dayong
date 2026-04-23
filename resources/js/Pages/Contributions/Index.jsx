import { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ContributionsIndex({ contributions, activeEvent, message }) {
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [search, setSearch] = useState('');
    const [dateSearch, setDateSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name'); // 'name', 'date'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

    // Local state for notes to avoid server request on every keystroke
    const [localNotes, setLocalNotes] = useState({});

    // Helper to format a date for display (e.g., "Apr 23, 2026")
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    // Filtered + Sorted contributions (client‑side)
    const filteredContributions = useMemo(() => {
        let result = [...contributions];

        // 1. Search by member name
        if (search) {
            result = result.filter(c =>
                c.member.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        // 2. Search by date (flexible – matches formatted date string)
        if (dateSearch) {
            result = result.filter(c => {
                const formattedDate = formatDateForDisplay(c.date_given);
                return formattedDate.toLowerCase().includes(dateSearch.toLowerCase());
            });
        }

        // 3. Filter by status
        if (statusFilter !== 'all') {
            result = result.filter(c => c.status === statusFilter);
        }

        // 4. Sorting
        result.sort((a, b) => {
            let aVal, bVal;
            if (sortBy === 'name') {
                aVal = a.member.name;
                bVal = b.member.name;
            } else if (sortBy === 'date') {
                aVal = a.date_given ? new Date(a.date_given) : new Date(0);
                bVal = b.date_given ? new Date(b.date_given) : new Date(0);
            }
            if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [contributions, search, dateSearch, statusFilter, sortBy, sortOrder]);

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

    // Helper to format date from backend to YYYY-MM-DD (for input)
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
    };

    // Handle notes blur – save only when leaving the field
    const handleNotesBlur = (contributionId, value) => {
        const originalContribution = contributions.find(c => c.id === contributionId);
        if (originalContribution && originalContribution.notes !== value) {
            updateField(contributionId, 'notes', value);
        }
    };

    // Toggle sort for a given field
    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
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

                    {/* Filters & Sorting */}
                    <div className="mb-4 flex flex-wrap gap-4 items-center">
                        <input
                            type="text"
                            placeholder="Search member..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="rounded border px-3 py-1"
                        />

                        <input
                            type="text"
                            placeholder="Filter by date (e.g., Aug 20, 2026)"
                            value={dateSearch}
                            onChange={e => setDateSearch(e.target.value)}
                            className="rounded border px-3 py-1"
                        />

                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="rounded border px-3 py-1"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="partial">Partial</option>
                            <option value="completed">Completed</option>
                        </select>

                        <button
                            onClick={() => toggleSort('name')}
                            className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
                        >
                            Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </button>

                        <button
                            onClick={() => toggleSort('date')}
                            className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
                        >
                            Date Given {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </button>
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
                                    <th className="px-4 py-2 text-left">Last Updated By</th>
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
                                                value={localNotes[contribution.id] ?? contribution.notes ?? ''}
                                                onChange={e => setLocalNotes(prev => ({ ...prev, [contribution.id]: e.target.value }))}
                                                onBlur={e => handleNotesBlur(contribution.id, e.target.value)}
                                                className="border rounded px-1 w-32"
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-gray-500 text-sm">
                                            {contribution.updater?.name || '—'}
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
