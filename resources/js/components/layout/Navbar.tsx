import { Link } from '@inertiajs/react';
import NavIcons from './NavIcons';

interface NavbarProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    isMobile: boolean;
    showMobileMenu: boolean;
    setShowMobileMenu: (show: boolean) => void;
}

export default function Navbar({ darkMode, toggleDarkMode, isMobile, showMobileMenu, setShowMobileMenu }: NavbarProps) {
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

                    <NavIcons
                        darkMode={darkMode}
                        toggleDarkMode={toggleDarkMode}
                        isMobile={isMobile}
                        showMobileMenu={showMobileMenu}
                        setShowMobileMenu={setShowMobileMenu}
                    />
                </div>
            </div>
        </nav>
    );
}
