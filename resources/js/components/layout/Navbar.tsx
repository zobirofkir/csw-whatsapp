import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { FaBookmark, FaCog, FaHeart, FaSignOutAlt, FaUser } from 'react-icons/fa';
import NavIcons from './NavIcons';

interface NavbarProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    isMobile: boolean;
    showMobileMenu: boolean;
    setShowMobileMenu: (show: boolean) => void;
}

export default function Navbar({ darkMode, toggleDarkMode, isMobile, showMobileMenu, setShowMobileMenu }: NavbarProps) {
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
                            <Link href="/" className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 px-4 md:hidden block">
                                SocialApp
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <div className={`mx-4 flex-1 ${!showSearch && isMobile ? 'hidden' : 'block'}`}>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full rounded-full bg-gray-100 px-4 py-2 text-sm sm:text-base
                                    focus:ring-2 focus:ring-blue-500 focus:outline-none
                                    dark:bg-gray-700 dark:text-gray-200"
                                />
                                {isMobile && showSearch && (
                                    <button
                                        onClick={() => setShowSearch(false)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search Toggle */}
                    {isMobile && !showSearch && (
                        <button
                            onClick={() => setShowSearch(true)}
                            className="mx-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    )}

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
                            <div className="profile-menu absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg
                                ring-1 ring-black ring-opacity-5 dark:bg-gray-700
                                transform origin-top-right transition-all duration-200 ease-out">
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
