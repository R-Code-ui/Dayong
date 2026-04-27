import { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ContributionsIndex({ contributions, activeEvent, message }) {
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [search, setSearch] = useState('');
    const [dateSearch, setDateSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    const [localNotes, setLocalNotes] = useState({});

    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const filteredContributions = useMemo(() => {
        let result = [...contributions];
        if (search) {
            result = result.filter(c =>
                c.member.name.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (dateSearch) {
            result = result.filter(c => {
                const formattedDate = formatDateForDisplay(c.date_given);
                return formattedDate.toLowerCase().includes(dateSearch.toLowerCase());
            });
        }
        if (statusFilter !== 'all') {
            result = result.filter(c => c.status === statusFilter);
        }
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

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
    };

    const handleNotesBlur = (contributionId, value) => {
        const originalContribution = contributions.find(c => c.id === contributionId);
        if (originalContribution && originalContribution.notes !== value) {
            updateField(contributionId, 'notes', value);
        }
    };

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
            <AuthenticatedLayout header={<h2 className="text-2xl font-black text-[#080616]">Contributions</h2>}>
                <div className="flex min-h-[400px] items-center justify-center rounded-3xl border-2 border-dashed border-gray-100 bg-white p-12 text-center text-gray-400 font-bold uppercase tracking-widest">
                    {message}
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-black tracking-tight text-[#080616]">Contributions for {activeEvent?.name}</h2>}
        >
            <Head title="Contributions" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Bulk actions */}
                    <div className="mb-8 p-6 rounded-3xl bg-[#080616] shadow-xl">
                        <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Bulk Management Actions</p>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => bulkUpdate('has_money', true)}
                                className="rounded-xl bg-[#2F2FE4] px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-[#162E93] transition-all"
                            >
                                + Mark Money
                            </button>
                            <button
                                onClick={() => bulkUpdate('has_rice', true)}
                                className="rounded-xl bg-[#2F2FE4] px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-[#162E93] transition-all"
                            >
                                + Mark Rice
                            </button>
                            <button
                                onClick={() => bulkUpdate('has_money', false)}
                                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-red-500 hover:bg-red-500 hover:text-white transition-all"
                            >
                                Remove Money
                            </button>
                            <button
                                onClick={() => bulkUpdate('has_rice', false)}
                                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-red-500 hover:bg-red-500 hover:text-white transition-all"
                            >
                                Remove Rice
                            </button>
                        </div>
                    </div>

                    {/* Filters & Sorting */}
                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:flex lg:items-center lg:justify-between">
                        <div className="flex flex-1 gap-3">
                            <input
                                type="text"
                                placeholder="Search member..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full rounded-xl border-gray-100 bg-white px-4 py-2 text-sm font-bold shadow-sm focus:border-[#2F2FE4] focus:ring-[#2F2FE4]"
                            />
                            <input
                                type="text"
                                placeholder="Filter date..."
                                value={dateSearch}
                                onChange={e => setDateSearch(e.target.value)}
                                className="w-full rounded-xl border-gray-100 bg-white px-4 py-2 text-sm font-bold shadow-sm focus:border-[#2F2FE4] focus:ring-[#2F2FE4]"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="rounded-xl border-gray-100 bg-white px-4 py-2 text-sm font-bold shadow-sm focus:border-[#2F2FE4] focus:ring-[#2F2FE4]"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="partial">Partial</option>
                                <option value="completed">Completed</option>
                            </select>

                            <button
                                onClick={() => toggleSort('name')}
                                className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${sortBy === 'name' ? 'bg-[#1A1953] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                            >
                                Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </button>

                            <button
                                onClick={() => toggleSort('date')}
                                className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${sortBy === 'date' ? 'bg-[#1A1953] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                            >
                                Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-4">
                                            <input type="checkbox" onChange={toggleSelectAll} className="rounded border-gray-300 text-[#2F2FE4] focus:ring-[#2F2FE4]" />
                                        </th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Member</th>
                                        <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">Money (₱200)</th>
                                        <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">Rice</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Date Given</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Notes</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Updated By</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredContributions.map(contribution => (
                                        <tr key={contribution.id} className="group transition-colors hover:bg-gray-50/50">
                                            <td className="px-6 py-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMembers.includes(contribution.member.id)}
                                                    onChange={() => toggleSelect(contribution.member.id)}
                                                    className="rounded border-gray-300 text-[#2F2FE4] focus:ring-[#2F2FE4]"
                                                />
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-[#080616]">
                                                {contribution.member.name}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={contribution.has_money}
                                                    onChange={e => updateField(contribution.id, 'has_money', e.target.checked)}
                                                    className="h-5 w-5 rounded border-gray-300 text-[#2F2FE4] focus:ring-[#2F2FE4] transition-all"
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={contribution.has_rice}
                                                    onChange={e => updateField(contribution.id, 'has_rice', e.target.checked)}
                                                    className="h-5 w-5 rounded border-gray-300 text-[#2F2FE4] focus:ring-[#2F2FE4] transition-all"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="date"
                                                    value={formatDateForInput(contribution.date_given)}
                                                    onChange={e => updateField(contribution.id, 'date_given', e.target.value)}
                                                    className="rounded-lg border-gray-100 bg-gray-50/50 text-xs font-bold focus:border-[#2F2FE4] focus:ring-0"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={contribution.status}
                                                    onChange={e => updateField(contribution.id, 'status', e.target.value)}
                                                    className={`rounded-full border-none px-4 py-1 text-[10px] font-black uppercase tracking-wider focus:ring-2 focus:ring-[#2F2FE4] ${
                                                        contribution.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        contribution.status === 'partial' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                                                    }`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="partial">Partial</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="text"
                                                    value={localNotes[contribution.id] ?? contribution.notes ?? ''}
                                                    onChange={e => setLocalNotes(prev => ({ ...prev, [contribution.id]: e.target.value }))}
                                                    onBlur={e => handleNotesBlur(contribution.id, e.target.value)}
                                                    placeholder="Add note..."
                                                    className="w-32 rounded-lg border-transparent bg-transparent px-2 py-1 text-xs font-medium placeholder:text-gray-300 focus:border-gray-200 focus:bg-white focus:ring-0 group-hover:border-gray-100 group-hover:bg-gray-50/50 transition-all"
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold text-gray-400">
                                                {contribution.updater?.name ? (
                                                    <span className="flex items-center gap-1">
                                                        <span className="h-1 w-1 rounded-full bg-[#2F2FE4]"></span>
                                                        {contribution.updater.name}
                                                    </span>
                                                ) : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
