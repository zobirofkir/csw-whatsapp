import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { FaBookmark, FaCog, FaHeart, FaSignOutAlt, FaUser } from 'react-icons/fa';
import NavIcons from './NavIcons';
import DarkModeButton from './buttons/DarkModeButton';

interface NavbarProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    isMobile: boolean;
    showMobileMenu: boolean;
    setShowMobileMenu: (show: boolean) => void;
}

export default function Navbar({ darkMode, toggleDarkMode, isMobile, showMobileMenu, setShowMobileMenu }: NavbarProps) {
    const { auth } = usePage().props as any;
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.profile-menu') && !target.closest('.mobile-menu-button')) {
                setShowProfileMenu(false);
                if (!target.closest('.sidebar')) {
                    setShowMobileMenu(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="fixed z-10 w-full bg-white shadow-md dark:bg-gray-800">
            <div className="mx-auto max-w-7xl px-2 sm:px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo and Search Container */}
                    <div className="flex flex-1 items-center justify-start">
                        {/* Logo - Hidden when search is active on mobile */}
                        <div className={`flex-shrink-0 ${showSearch && isMobile ? 'hidden' : 'block'}`}>
                            <Link
                                href={auth?.user ? `/account/auth/${auth.user.name}` : '/'}
                                className="px-2 text-xl font-bold text-blue-600 sm:text-2xl md:px-0 dark:text-blue-400"
                            >
                                SocialApp
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <div
                            className={`mx-4 flex-1 transition-all duration-300 ease-in-out ${
                                !showSearch && isMobile ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
                            }`}
                        >
                            <div className="relative">
                                <svg
                                    className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full rounded-full bg-gray-100 py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-base dark:bg-gray-700 dark:text-gray-200"
                                />
                                {isMobile && showSearch && (
                                    <button
                                        onClick={() => setShowSearch(false)}
                                        className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 transition-opacity duration-200 hover:text-gray-700"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search Toggle */}
                    {isMobile && !showSearch && (
                        <button onClick={() => setShowSearch(true)} className="mx-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    )}

                    <div className="block md:hidden">
                        <DarkModeButton darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                    </div>

                    {/* Nav Icons */}
                    <div className="relative">
                        <NavIcons
                            darkMode={darkMode}
                            toggleDarkMode={toggleDarkMode}
                            isMobile={isMobile}
                            showMobileMenu={showMobileMenu}
                            setShowMobileMenu={setShowMobileMenu}
                            showProfileMenu={showProfileMenu}
                            setShowProfileMenu={setShowProfileMenu}
                        />

                        {/* Profile Dropdown Menu */}
                        {showProfileMenu && (
                            <div className="profile-menu ring-opacity-5 absolute right-0 mt-2 w-48 origin-top-right transform rounded-md bg-white py-1 shadow-lg ring-1 ring-black transition-all duration-200 ease-out dark:bg-gray-700">
                                <Link
                                    href="/settings/profile"
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                                >
                                    <FaUser className="mr-3" />
                                    Your Profile
                                </Link>
                                <Link
                                    href="/settings"
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                                >
                                    <FaCog className="mr-3" />
                                    Settings
                                </Link>
                                <Link
                                    href="/saved-posts"
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                                >
                                    <FaBookmark className="mr-3" />
                                    Saved Posts
                                </Link>
                                <Link
                                    href="/liked-posts"
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                                >
                                    <FaHeart className="mr-3" />
                                    Liked Posts
                                </Link>
                                <div className="my-1 border-t border-gray-200 dark:border-gray-600"></div>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                                >
                                    <FaSignOutAlt className="mr-3" />
                                    Logout
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
