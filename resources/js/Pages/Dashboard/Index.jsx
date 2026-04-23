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
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>}
        >
            <Head title="Dashboard" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900">Active Event: {stats.active_event_name}</h3>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Members</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.total_members}</dd>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                                <dd className="mt-1 text-3xl font-semibold text-green-600">{stats.completed}</dd>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">Partial</dt>
                                <dd className="mt-1 text-3xl font-semibold text-yellow-600">{stats.partial}</dd>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                                <dd className="mt-1 text-3xl font-semibold text-red-600">{stats.pending}</dd>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Money Collected</dt>
                                <dd className="mt-1 text-3xl font-semibold text-indigo-600">₱{stats.total_money.toLocaleString()}</dd>
                            </div>
                        </div>
                    </div>

                    {/* Export Buttons */}
                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={exportCSV}
                            className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                        >
                            Export to CSV
                        </button>
                        <button
                            onClick={exportPDF}
                            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                        >
                            Download PDF Report
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
