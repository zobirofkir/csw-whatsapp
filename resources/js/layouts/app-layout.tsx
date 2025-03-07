import { type BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type ReactNode, useEffect, useState } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children }: AppLayoutProps) {
    const [darkMode, setDarkMode] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        const isDark = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        }

        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', String(newMode));
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className="min-h-screen bg-gray-100 transition-colors duration-200 dark:bg-gray-900">
            {/* Navigation Bar */}
            <nav className="fixed z-10 w-full bg-white shadow-md dark:bg-gray-800">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                SocialApp
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <div className="mx-4 hidden max-w-2xl flex-1 md:block">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full rounded-full bg-gray-100 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-gray-200"
                            />
                        </div>

                        {/* Navigation Icons */}
                        <div className="flex items-center space-x-2 md:space-x-4">
                            <button onClick={toggleDarkMode} className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                {darkMode ? (
                                    <svg className="h-6 w-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                        />
                                    </svg>
                                ) : (
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                        />
                                    </svg>
                                )}
                            </button>
                            <button className="relative rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <svg className="h-6 w-6 dark:text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                </svg>
                                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                    3
                                </span>
                            </button>
                            <button className="relative rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <svg className="h-6 w-6 dark:text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                                </svg>
                                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                    5
                                </span>
                            </button>
                            <button className="h-10 w-10 overflow-hidden rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
                                <img src="https://i.pravatar.cc/150?img=12" alt="Profile" className="h-full w-full object-cover" />
                            </button>
                            {isMobile && (
                                <button
                                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                                    className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <svg className="h-6 w-6 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex">
                        {/* Left Sidebar */}
                        <div
                            className={`${isMobile ? (showMobileMenu ? 'bg-opacity-50 fixed inset-0 z-50 bg-gray-900' : 'hidden') : 'fixed left-0 w-1/4'} h-screen overflow-y-auto pt-4 pl-4 md:block`}
                        >
                            <div className="space-y-2 rounded-lg bg-white p-4 dark:bg-gray-800">
                                <SidebarLink href="/profile">
                                    <div className="flex items-center space-x-2">
                                        <img src="https://i.pravatar.cc/150?img=12" alt="Profile" className="h-8 w-8 rounded-full" />
                                        <span className="text-black dark:text-white">John Doe</span>
                                    </div>
                                </SidebarLink>
                                <SidebarLink href="/friends">
                                    <div className="flex items-center space-x-2">
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                            />
                                        </svg>
                                        <span className="text-black dark:text-white">Friends</span>
                                    </div>
                                </SidebarLink>
                                <SidebarLink href="/groups">
                                    <div className="flex items-center space-x-2">
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        <span className="text-black dark:text-white">Groups</span>
                                    </div>
                                </SidebarLink>
                                <SidebarLink href="/marketplace">
                                    <div className="flex items-center space-x-2">
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                            />
                                        </svg>
                                        <span className="text-black dark:text-white">Marketplace</span>
                                    </div>
                                </SidebarLink>
                                <SidebarLink href="/watch">
                                    <div className="flex items-center space-x-2">
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span className="text-black dark:text-white">Watch</span>
                                    </div>
                                </SidebarLink>
                                <SidebarLink href="/memories">
                                    <div className="flex items-center space-x-2">
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span className="text-black dark:text-white">Memories</span>
                                    </div>
                                </SidebarLink>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="mx-auto w-full md:w-2/4">{children}</div>

                        {/* Right Sidebar */}
                        <div className="fixed right-0 hidden h-screen w-1/4 overflow-y-auto pt-4 pr-4 lg:block">
                            <div className="mb-4 rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                                <h3 className="mb-3 font-semibold dark:text-gray-200">Contacts</h3>
                                <div className="space-y-4">
                                    {[
                                        { name: 'Sarah Johnson', status: 'online', img: 'https://i.pravatar.cc/150?img=1' },
                                        { name: 'Michael Chen', status: 'offline', img: 'https://i.pravatar.cc/150?img=2' },
                                        { name: 'Emma Wilson', status: 'online', img: 'https://i.pravatar.cc/150?img=3' },
                                    ].map((contact) => (
                                        <div key={contact.name} className="flex items-center space-x-3">
                                            <div className="relative">
                                                <img src={contact.img} alt={contact.name} className="h-8 w-8 rounded-full" />
                                                <span
                                                    className={`absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white ${contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}
                                                />
                                            </div>
                                            <span className="dark:text-gray-200">{contact.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SidebarLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <Link href={href} className="flex items-center space-x-2 rounded-lg p-2 font-medium text-gray-700 hover:bg-gray-200">
            <span>{children}</span>
        </Link>
    );
}
