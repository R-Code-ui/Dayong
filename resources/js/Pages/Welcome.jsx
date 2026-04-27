import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome({ auth }) {
    const user = auth.user;
    const isAdmin = user?.is_admin === true;
    const isMember = user?.is_member === true;

    // Determine the button text and destination based on role
    let buttonText = 'Sign In';
    let buttonLink = route('login');
    let buttonClass = 'bg-[#080616] hover:bg-[#1A1953]';

    if (user) {
        if (isAdmin) {
            buttonText = 'Go to Dashboard';
            buttonLink = route('dashboard');
            buttonClass = 'bg-[#162E93] hover:bg-[#2F2FE4]';
        } else if (isMember) {
            buttonText = 'Go to My Contributions';
            buttonLink = route('my.contributions');
            buttonClass = 'bg-[#162E93] hover:bg-[#2F2FE4]';
        }
    }

    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-[#FFFFFF] text-[#080616] selection:bg-[#2F2FE4] selection:text-white flex flex-col">
                {/* Top Accent Bar */}
                <div className="h-2 w-full bg-gradient-to-r from-[#2F2FE4] via-[#162E93] to-[#080616]"></div>

                {/* Main Content Area */}
                <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16">

                    {/* Background Decorative Blurs */}
                    <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#2F2FE4]/5 blur-3xl"></div>
                    <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#162E93]/5 blur-3xl"></div>

                    <div className="relative w-full max-w-4xl">
                        <header className="flex flex-col items-center justify-center space-y-10">
                            {/* Logo */}
                            <div className="transform transition duration-500 hover:scale-105">
                                <ApplicationLogo className="h-28 w-auto drop-shadow-sm" />
                            </div>

                            {/* Hero Typography */}
                            <div className="text-center">
                                <h1 className="text-4xl font-extrabold tracking-tight text-[#080616] sm:text-6xl">
                                    Dayong Management System
                                </h1>
                                <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
                                    Secure, transparent, and digital tracking for community burial contributions and event records.
                                </p>
                            </div>

                            {/* Login / Dashboard / My Contributions Action */}
                            <nav className="flex items-center justify-center pt-4">
                                <Link
                                    href={buttonLink}
                                    className={`inline-flex items-center rounded-xl px-10 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#2F2FE4] focus:ring-offset-2 ${buttonClass} ${
                                        user ? 'shadow-[#162E93]/20' : 'shadow-black/10'
                                    }`}
                                >
                                    {buttonText}
                                    {user && (
                                        <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    )}
                                </Link>
                            </nav>
                        </header>

                        {/* Feature Section */}
                        <main className="mt-24 grid gap-8 md:grid-cols-2">
                            <div className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:border-[#2F2FE4]/30 hover:shadow-md">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#2F2FE4]/10 text-[#162E93]">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-[#1A1953]">Simplified Tracking</h2>
                                <p className="mt-2 leading-relaxed text-gray-500">
                                    Effortlessly record money (₱200) and rice contributions. Designed for quick data entry and accuracy.
                                </p>
                            </div>

                            <div className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:border-[#2F2FE4]/30 hover:shadow-md">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#2F2FE4]/10 text-[#162E93]">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-[#1A1953]">Automated Reporting</h2>
                                <p className="mt-2 leading-relaxed text-gray-500">
                                    Instantly generate CSV and PDF summaries. High-transparency records for every burial event.
                                </p>
                            </div>
                        </main>
                    </div>
                </div>

                {/* Footer with #080616 Background */}
                <footer className="bg-[#080616] py-12 text-center border-t border-white/10">
                    <div className="max-w-4xl mx-auto px-6">
                        <p className="text-white font-medium">Dayong Management System</p>
                        <p className="mt-2 text-sm text-white/50 leading-relaxed">
                            A specialized tool for managing community contributions efficiently.
                        </p>
                        <p className="mt-8 text-xs text-white/30 uppercase tracking-widest">
                            &copy; {new Date().getFullYear()} All Rights Reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
