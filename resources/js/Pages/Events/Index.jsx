import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ events, flash }) {
    const setActive = (event) => {
        if (confirm(`Set "${event.name}" as active event?`)) {
            router.put(route('admin.events.update', event.id), {
                is_active: true,
                name: event.name,
                date: event.date,
            });
        }
    };

    const handleDelete = (id, name) => {
        if (confirm(`Delete event "${name}"?`)) {
            router.delete(route('admin.events.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-black tracking-tight text-[#080616]">Events Directory</h2>}
        >
            <Head title="Events" />
            <div className="py-2">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-6 flex items-center gap-3 rounded-xl bg-green-50 p-4 text-sm font-bold text-green-800 border border-green-100">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            {flash.success}
                        </div>
                    )}

                    <div className="mb-6 flex justify-end">
                        <Link
                            href={route('admin.events.create')}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F2FE4] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#2F2FE4]/20 hover:bg-[#162E93] transition-all active:scale-95"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            New Event
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Event Name</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Scheduled Date</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {events.map(event => (
                                    <tr key={event.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-[#080616]">{event.name}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                            {event.date}
                                        </td>
                                        <td className="px-6 py-4">
                                            {event.is_active ? (
                                                <span className="inline-flex items-center rounded-full bg-[#2F2FE4] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">Active</span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gray-500">Inactive</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center gap-4">
                                                {!event.is_active && (
                                                    <button
                                                        onClick={() => setActive(event)}
                                                        className="text-xs font-black uppercase tracking-wider text-[#2F2FE4] hover:text-[#162E93] transition-colors"
                                                    >
                                                        Set Active
                                                    </button>
                                                )}
                                                <Link
                                                    href={route('admin.events.edit', event.id)}
                                                    className="text-xs font-black uppercase tracking-wider text-[#1A1953] hover:opacity-70 transition-opacity"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(event.id, event.name)}
                                                    className="text-xs font-black uppercase tracking-wider text-red-500 hover:text-red-700 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
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
