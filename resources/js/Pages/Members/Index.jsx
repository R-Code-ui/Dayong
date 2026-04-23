import { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ members, flash }) {
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

    // members.data is the array of members for current page
    const memberArray = members.data || [];

    // Client-side filtering & sorting (on current page only)
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
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Members</h2>}
        >
            <Head title="Members" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Flash message */}
                    {flash?.success && (
                        <div className="mb-4 rounded bg-green-100 p-3 text-green-800">
                            {flash.success}
                        </div>
                    )}

                    {/* Search + Sort + Add Button */}
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="rounded-md bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
                            >
                                Name {sortOrder === 'asc' ? 'A→Z' : 'Z→A'}
                            </button>
                        </div>
                        <Link
                            href={route('admin.members.create')}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                        >
                            + Add Member
                        </Link>
                    </div>

                    {/* Members Table */}
                    <div className="overflow-x-auto bg-white shadow-sm rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredMembers.length === 0 ? (
                                    <tr>
                                        <td colSpan="2" className="px-6 py-4 text-center text-gray-500">
                                            No members found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMembers.map(member => (
                                        <tr key={member.id}>
                                            <td className="whitespace-nowrap px-6 py-4">{member.name}</td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <Link
                                                    href={route('admin.members.edit', member.id)}
                                                    className="mr-3 text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(member.id, member.name)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Links */}
                    {members.links && members.links.length > 0 && (
                        <div className="mt-4 flex justify-center">
                            <div className="flex space-x-1">
                                {members.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 rounded text-sm ${
                                            link.active
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
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
