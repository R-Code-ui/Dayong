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
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Events</h2>}
        >
            <Head title="Events" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 rounded bg-green-100 p-3 text-green-800">
                            {flash.success}
                        </div>
                    )}

                    <div className="mb-4 flex justify-end">
                        <Link
                            href={route('admin.events.create')}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                        >
                            + New Event
                        </Link>
                    </div>

                    <div className="overflow-x-auto bg-white shadow-sm rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {events.map(event => (
                                    <tr key={event.id}>
                                        <td className="px-6 py-4">{event.name}</td>
                                        <td className="px-6 py-4">{event.date}</td>
                                        <td className="px-6 py-4">
                                            {event.is_active ? (
                                                <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">Active</span>
                                            ) : (
                                                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800">Inactive</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {!event.is_active && (
                                                <button
                                                    onClick={() => setActive(event)}
                                                    className="mr-3 text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Set Active
                                                </button>
                                            )}
                                            <Link
                                                href={route('admin.events.edit', event.id)}
                                                className="mr-3 text-indigo-600 hover:text-indigo-900"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(event.id, event.name)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
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
