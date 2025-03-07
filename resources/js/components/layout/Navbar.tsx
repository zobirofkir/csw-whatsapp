import { Link } from '@inertiajs/react';
import { useState } from 'react';
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

    return (
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
                            <div className="ring-opacity-5 absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black dark:bg-gray-700">
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
