import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create() {
    const [name, setName] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        router.post(route('admin.members.store'), { name }, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-black tracking-tight text-[#080616]">Add Member</h2>}
        >
            <Head title="Add Member" />
            <div className="py-6">
                <div className="mx-auto max-w-2xl">
                    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50">
                        <div className="bg-[#080616] px-8 py-6">
                            <h3 className="text-lg font-bold text-white">Member Information</h3>
                            <p className="text-xs text-gray-400">Enter the full name of the new member.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="mb-8">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="e.g. Juan Dela Cruz"
                                    className="block w-full rounded-xl border-gray-100 bg-gray-50/50 py-4 text-sm font-bold focus:border-[#2F2FE4] focus:ring-[#2F2FE4] transition-all"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 rounded-xl bg-[#2F2FE4] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#2F2FE4]/20 hover:bg-[#162E93] disabled:opacity-50 transition-all active:scale-95"
                                >
                                    {processing ? 'Saving...' : 'Save Member Details'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.get(route('admin.members.index'))}
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
