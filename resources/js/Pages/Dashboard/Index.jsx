import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard({ stats }) {
    const exportCSV = () => {
        window.location.href = route('admin.export.csv');
    };

    const exportPDF = () => {
        window.location.href = route('admin.report.pdf');
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-[#080616]">Dashboard</h2>
                        <p className="text-sm font-medium text-gray-500">Overview of system activity and contributions.</p>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-2">
                {/* Active Event Banner */}
                <div className="mb-8 rounded-2xl bg-[#080616] p-6 shadow-sm border border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2F2FE4]/20 text-[#2F2FE4]">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Current Active Event</p>
                            <h3 className="text-xl font-bold text-white">{stats.active_event_name}</h3>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
                    {/* Total Members */}
                    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-hover hover:shadow-md">
                        <dt className="text-sm font-bold uppercase tracking-tight text-gray-400">Total Members</dt>
                        <dd className="mt-2 text-4xl font-black text-[#080616]">{stats.total_members}</dd>
                        <div className="absolute -right-2 -top-2 h-12 w-12 rounded-full bg-gray-50 opacity-50"></div>
                    </div>

                    {/* Completed */}
                    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-hover hover:shadow-md">
                        <dt className="text-sm font-bold uppercase tracking-tight text-gray-400">Completed</dt>
                        <dd className="mt-2 text-4xl font-black text-green-600">{stats.completed}</dd>
                        <div className="absolute bottom-0 left-0 h-1 w-full bg-green-500"></div>
                    </div>

                    {/* Partial */}
                    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-hover hover:shadow-md">
                        <dt className="text-sm font-bold uppercase tracking-tight text-gray-400">Partial</dt>
                        <dd className="mt-2 text-4xl font-black text-yellow-500">{stats.partial}</dd>
                        <div className="absolute bottom-0 left-0 h-1 w-full bg-yellow-500"></div>
                    </div>

                    {/* Pending */}
                    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-hover hover:shadow-md">
                        <dt className="text-sm font-bold uppercase tracking-tight text-gray-400">Pending</dt>
                        <dd className="mt-2 text-4xl font-black text-red-500">{stats.pending}</dd>
                        <div className="absolute bottom-0 left-0 h-1 w-full bg-red-500"></div>
                    </div>

                    {/* Total Money */}
                    <div className="relative overflow-hidden rounded-2xl border border-[#162E93]/10 bg-white p-6 shadow-sm transition-hover hover:shadow-md ring-1 ring-[#162E93]/5">
                        <dt className="text-sm font-bold uppercase tracking-tight text-[#162E93]">Money Collected</dt>
                        <dd className="mt-2 text-3xl font-black text-[#2F2FE4]">₱{stats.total_money.toLocaleString()}</dd>
                        <div className="absolute -right-4 -bottom-4 h-16 w-16 rounded-full bg-[#2F2FE4]/5"></div>
                    </div>
                </div>

                {/* Export Buttons Section */}
                <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 border-t border-gray-100 pt-8">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mr-2">Generate Reports:</p>
                    <button
                        onClick={exportCSV}
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-green-700 shadow-sm ring-1 ring-inset ring-green-600/20 hover:bg-green-50 transition-all active:scale-95"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Export CSV
                    </button>
                    <button
                        onClick={exportPDF}
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#080616] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-black/10 hover:bg-[#1A1953] transition-all active:scale-95"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Download PDF Report
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
