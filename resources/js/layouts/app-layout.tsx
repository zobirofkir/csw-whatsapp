import { type BreadcrumbItem } from '@/types';
import { type ReactNode, useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

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
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            {/* Navigation Bar */}
            <nav className="bg-white dark:bg-gray-800 shadow-md fixed w-full z-10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/" className="text-blue-600 dark:text-blue-400 text-2xl font-bold">
                                SocialApp
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-2xl mx-4 hidden md:block">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Navigation Icons */}
                        <div className="flex items-center space-x-2 md:space-x-4">
                            <button onClick={toggleDarkMode} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                                {darkMode ? (
                                    <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                            </button>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full relative">
                                <svg className="w-6 h-6 dark:text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                </svg>
                                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
                            </button>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full relative">
                                <svg className="w-6 h-6 dark:text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                                </svg>
                                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">5</span>
                            </button>
                            <button className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 overflow-hidden">
                                <img src="https://i.pravatar.cc/150?img=12" alt="Profile" className="w-full h-full object-cover" />
                            </button>
                            {isMobile && (
                                <button
                                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                                >
                                    <svg className="w-6 h-6 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex">

                        {/* Left Sidebar */}
                        <div className={`${isMobile ? (showMobileMenu ? 'fixed inset-0 bg-gray-900 bg-opacity-50 z-50' : 'hidden') : 'w-1/4 fixed left-0'} md:block pt-4 pl-4 h-screen overflow-y-auto`}>
                            <div className="space-y-2 bg-white dark:bg-gray-800 p-4 rounded-lg">
                                <SidebarLink href="/profile" icon="user">
                                    <div className="flex items-center space-x-2">
                                        <img src="https://i.pravatar.cc/150?img=12" alt="Profile" className="w-8 h-8 rounded-full" />
                                        <span className="text-black dark:text-white">John Doe</span>
                                    </div>
                                </SidebarLink>
                                <SidebarLink href="/friends" icon="users">
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span className="text-black dark:text-white">Friends</span>
                                    </div>
                                </SidebarLink>
                                <SidebarLink href="/groups" icon="userGroup">
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="text-black dark:text-white">Groups</span>
                                    </div>
                                </SidebarLink>
                                <SidebarLink href="/marketplace" icon="shopping">
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        <span className="text-black dark:text-white">Marketplace</span>
                                    </div>
                                </SidebarLink>
                                <SidebarLink href="/watch" icon="play">
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-black dark:text-white">Watch</span>
                                    </div>
                                </SidebarLink>
                                <SidebarLink href="/memories" icon="clock">
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-black dark:text-white">Memories</span>
                                    </div>
                                </SidebarLink>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="w-full md:w-2/4 mx-auto">
                            {children}
                        </div>

                        {/* Right Sidebar */}
                        <div className="hidden lg:block w-1/4 fixed right-0 pt-4 pr-4 h-screen overflow-y-auto">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
                                <h3 className="font-semibold mb-3 dark:text-gray-200">Contacts</h3>
                                <div className="space-y-4">
                                    {[
                                        { name: 'Sarah Johnson', status: 'online', img: 'https://i.pravatar.cc/150?img=1' },
                                        { name: 'Michael Chen', status: 'offline', img: 'https://i.pravatar.cc/150?img=2' },
                                        { name: 'Emma Wilson', status: 'online', img: 'https://i.pravatar.cc/150?img=3' },
                                    ].map((contact) => (
                                        <div key={contact.name} className="flex items-center space-x-3">
                                            <div className="relative">
                                                <img src={contact.img} alt={contact.name} className="w-8 h-8 rounded-full" />
                                                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`} />
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

function SidebarLink({ href, children, icon }: { href: string; children: ReactNode; icon: string }) {
    return (
        <Link
            href={href}
            className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-lg text-gray-700 font-medium"
        >
            <span>{children}</span>
        </Link>
    );
}
