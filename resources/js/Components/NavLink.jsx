import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'group flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ' +
                (active
                    ? 'bg-[#1A1953] text-white shadow-sm ring-1 ring-white/10'
                    : 'text-gray-400 hover:bg-[#162E93]/20 hover:text-white') +
                ' ' + className
            }
        >
            {children}
        </Link>
    );
}
