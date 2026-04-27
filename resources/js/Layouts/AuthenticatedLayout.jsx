import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const isAdmin = user?.is_admin === true;
    const isMember = user?.is_member === true;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-white">
            {/* Mobile Header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 md:hidden">
                <Link href="/" className="bg-white p-1 rounded">
                    <ApplicationLogo className="h-10 w-auto" />
                </Link>
                <button
                    onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-none"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showingNavigationDropdown ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>
            </div>

            {/* Sidebar Container */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-[#080616] transition-transform duration-300 ease-in-out md:translate-x-0 ${
                    showingNavigationDropdown ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-full flex-col">

                    {/* User Profile Section - AT THE TOP */}
                    <div className="border-b border-white/5 bg-[#1A1953]/20 p-4 pt-6">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex w-full items-center gap-3 rounded-xl p-2 transition hover:bg-white/5 focus:outline-none text-left">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2F2FE4] text-sm font-bold text-white shadow-lg ring-1 ring-white/20">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="truncate text-sm font-semibold text-white">{user.name}</p>
                                        <p className="truncate text-[11px] text-gray-400">Settings</p>
                                    </div>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content align="left" width="48" contentClasses="py-1 bg-white shadow-2xl mt-2">
                                <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
                        {isAdmin && (
                            <div className="space-y-1">
                                <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[2px] text-gray-400">Administrator</p>
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>
                                <NavLink href={route('admin.members.index')} active={route().current('admin.members.*')}>
                                    Members
                                </NavLink>
                                <NavLink href={route('admin.events.index')} active={route().current('admin.events.*')}>
                                    Events
                                </NavLink>
                                <NavLink href={route('admin.contributions.index')} active={route().current('admin.contributions.*')}>
                                    Contributions
                                </NavLink>
                            </div>
                        )}

                        {isMember && (
                            <div className={isAdmin ? "mt-8" : ""}>
                                <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[2px] text-gray-400">Member Portal</p>
                                <NavLink href={route('my.contributions')} active={route().current('my.contributions')}>
                                    My Contributions
                                </NavLink>
                            </div>
                        )}
                    </nav>

                    {/* Lettering Logo Section - AT THE BOTTOM */}
                    <div className="mt-auto flex h-24 items-center justify-center border-t border-white/5 px-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <span className="text-xs font-black tracking-tighter text-white transition-opacity group-hover:opacity-80">
                                DAYONG MANAGEMENT SYSTEM
                            </span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-col md:pl-64">
                {header && (
                    <header className="sticky top-0 z-40 bg-white/80 px-4 py-6 backdrop-blur-md border-b border-gray-100 sm:px-8">
                        <div className="max-w-7xl">
                            <h2 className="text-xl font-extrabold tracking-tight text-[#080616]">{header}</h2>
                        </div>
                    </header>
                )}

                <main className="p-4 sm:p-8">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>

            {/* Overlay for mobile toggle */}
            {showingNavigationDropdown && (
                <div
                    className="fixed inset-0 z-40 bg-[#080616]/40 backdrop-blur-sm md:hidden"
                    onClick={() => setShowingNavigationDropdown(false)}
                />
            )}
        </div>
    );
}
