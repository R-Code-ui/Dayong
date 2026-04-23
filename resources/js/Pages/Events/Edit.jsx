import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ event }) {
    const [form, setForm] = useState({
        name: event.name,
        date: event.date,
        is_active: event.is_active,
    });
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        router.put(route('admin.events.update', event.id), form, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Edit Event</h2>}
        >
            <Head title="Edit Event" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Event Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={e => setForm({ ...form, date: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={form.is_active}
                                        onChange={e => setForm({ ...form, is_active: e.target.checked })}
                                        className="mr-2 rounded border-gray-300"
                                    />
                                    Set as Active Event
                                </label>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    Update Event
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.get(route('admin.events.index'))}
                                    className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
