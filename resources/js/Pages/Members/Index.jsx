import { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ members, flash }) {
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const memberArray = members.data || [];

    const filteredMembers = useMemo(() => {
        let result = [...memberArray];
        if (search) {
            result = result.filter(m =>
                m.name.toLowerCase().includes(search.toLowerCase())
            );
        }
        result.sort((a, b) => {
            if (sortOrder === 'asc') return a.name.localeCompare(b.name);
            return b.name.localeCompare(a.name);
        });
        return result;
    }, [memberArray, search, sortOrder]);

    const handleDelete = (id, name) => {
        if (confirm(`Delete member "${name}"?`)) {
            router.delete(route('admin.members.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-black tracking-tight text-[#080616]">Manage Members</h2>}
        >
            <Head title="Members" />
            <div className="py-2">
                <div className="mx-auto max-w-7xl">
                    {flash?.success && (
                        <div className="mb-6 flex items-center gap-3 rounded-xl bg-green-50 p-4 text-sm font-bold text-green-800 border border-green-100">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            {flash.success}
                        </div>
                    )}

                    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-2 rounded-2xl">
                        <div className="flex flex-1 gap-2">
                            <div className="relative flex-1 max-w-sm">
                                <input
                                    type="text"
                                    placeholder="Search members..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full rounded-xl border-gray-100 bg-gray-50/50 py-3 pl-4 text-sm focus:border-[#2F2FE4] focus:ring-[#2F2FE4] placeholder:text-gray-400 transition-all"
                                />
                            </div>
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm font-bold text-[#1A1953] hover:bg-gray-50 transition-all"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
                                {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                            </button>
                        </div>
                        <Link
                            href={route('admin.members.create')}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F2FE4] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#2F2FE4]/20 hover:bg-[#162E93] transition-all active:scale-95"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            Add New Member
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Member Name</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredMembers.length === 0 ? (
                                    <tr>
                                        <td colSpan="2" className="px-6 py-12 text-center text-sm font-medium text-gray-400">No members found in your directory.</td>
                                    </tr>
                                ) : (
                                    filteredMembers.map(member => (
                                        <tr key={member.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1953]/5 text-xs font-bold text-[#1A1953]">
                                                        {member.name.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-bold text-[#080616]">{member.name}</span>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <Link
                                                        href={route('admin.members.edit', member.id)}
                                                        className="text-sm font-bold text-[#2F2FE4] hover:text-[#162E93]"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(member.id, member.name)}
                                                        className="text-sm font-bold text-red-500 hover:text-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {members.links && members.links.length > 3 && (
                        <div className="mt-8 flex justify-center">
                            <div className="inline-flex gap-1 rounded-xl bg-white p-1 shadow-sm border border-gray-100">
                                {members.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                            link.active
                                                ? 'bg-[#080616] text-white'
                                                : 'text-gray-500 hover:bg-gray-50'
                                        } ${!link.url ? 'opacity-30 cursor-not-allowed' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        preserveScroll
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
