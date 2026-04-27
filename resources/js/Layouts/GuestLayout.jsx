import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-white pt-6 sm:justify-center sm:pt-0">
            {/* Background Decorative Blur */}
            <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-[#2F2FE4]/5 blur-3xl"></div>

            <div className="relative z-10 transition-transform duration-500 hover:scale-105">
                <Link href="/">
                    <ApplicationLogo className="h-24 w-auto drop-shadow-sm" />
                </Link>
            </div>

            <div className="relative z-10 mt-8 w-full overflow-hidden border border-gray-100 bg-white px-8 py-10 shadow-[0px_20px_50px_rgba(8,6,22,0.05)] sm:max-w-md sm:rounded-2xl">
                {children}
            </div>

            <div className="mt-8 text-sm text-gray-400">
                &copy; {new Date().getFullYear()} Dayong Management System
            </div>
        </div>
    );
}
