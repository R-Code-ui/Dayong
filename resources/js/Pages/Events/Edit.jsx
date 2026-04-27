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
            header={<h2 className="text-2xl font-black tracking-tight text-[#080616]">Edit Event</h2>}
        >
            <Head title="Edit Event" />
            <div className="py-6">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50">
                        <div className="bg-[#1A1953] px-8 py-6">
                            <h3 className="text-lg font-bold text-white">Update Schedule</h3>
                            <p className="text-xs text-gray-300">Modifying settings for: <span className="text-white underline">{event.name}</span></p>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="mb-6">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Event Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="block w-full rounded-xl border-gray-100 bg-gray-50/50 py-4 text-sm font-bold focus:border-[#2F2FE4] focus:ring-[#2F2FE4] transition-all"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Date</label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={e => setForm({ ...form, date: e.target.value })}
                                    className="block w-full rounded-xl border-gray-100 bg-gray-50/50 py-4 text-sm font-bold focus:border-[#2F2FE4] focus:ring-[#2F2FE4] transition-all"
                                    required
                                />
                            </div>
                            <div className="mb-8">
                                <label className="group flex cursor-pointer items-center gap-3">
                                    <div className="relative flex h-5 w-5 items-center justify-center rounded border-2 border-gray-200 bg-white transition-colors group-hover:border-[#2F2FE4]">
                                        <input
                                            type="checkbox"
                                            checked={form.is_active}
                                            onChange={e => setForm({ ...form, is_active: e.target.checked })}
                                            className="peer absolute h-full w-full opacity-0 cursor-pointer"
                                        />
                                        <div className="h-2.5 w-2.5 scale-0 bg-[#2F2FE4] transition-transform peer-checked:scale-100 rounded-[1px]"></div>
                                    </div>
                                    <span className="text-sm font-bold text-[#1A1953]">Set as Active Event</span>
                                </label>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 rounded-xl bg-[#2F2FE4] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#2F2FE4]/20 hover:bg-[#162E93] disabled:opacity-50 transition-all active:scale-95"
                                >
                                    {processing ? 'Saving...' : 'Update Event'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.get(route('admin.events.index'))}
                                    className="rounded-xl bg-gray-100 px-6 py-4 text-sm font-bold text-[#1A1953] hover:bg-gray-200 transition-all"
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
