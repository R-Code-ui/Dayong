import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ member }) {
    const [name, setName] = useState(member.name);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        router.put(route('admin.members.update', member.id), { name }, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-black tracking-tight text-[#080616]">Edit Member</h2>}
        >
            <Head title="Edit Member" />
            <div className="py-6">
                <div className="mx-auto max-w-2xl">
                    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50">
                        <div className="bg-[#1A1953] px-8 py-6">
                            <h3 className="text-lg font-bold text-white">Modify Profile</h3>
                            <p className="text-xs text-gray-300 font-medium">Update the name for: <span className="text-white underline">{member.name}</span></p>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="mb-8">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="block w-full rounded-xl border-gray-100 bg-gray-50/50 py-4 text-sm font-bold focus:border-[#2F2FE4] focus:ring-[#2F2FE4] transition-all"
                                    required
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 rounded-xl bg-[#2F2FE4] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#2F2FE4]/20 hover:bg-[#162E93] disabled:opacity-50 transition-all active:scale-95"
                                >
                                    {processing ? 'Updating...' : 'Update Member Details'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.get(route('admin.members.index'))}
                                    className="rounded-xl bg-gray-100 px-6 py-4 text-sm font-bold text-[#1A1953] hover:bg-gray-200 transition-all"
                                >
                                    Cancel Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
