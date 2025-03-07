import { usePage } from '@inertiajs/react';
import DarkModeButton from './buttons/DarkModeButton';
import MessageButton from './buttons/MessageButton';
import MobileMenuButton from './buttons/MobileMenuButton';
import NotificationButton from './buttons/NotificationButton';

interface NavIconsProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    isMobile: boolean;
    showMobileMenu: boolean;
    setShowMobileMenu: (show: boolean) => void;
    showProfileMenu: boolean;
    setShowProfileMenu: (show: boolean) => void;
}

export default function NavIcons({
    darkMode,
    toggleDarkMode,
    isMobile,
    showMobileMenu,
    setShowMobileMenu,
    showProfileMenu,
    setShowProfileMenu,
}: NavIconsProps) {
    const handleProfileClick = () => {
        if (isMobile) {
            setShowMobileMenu(false);
        }
        setShowProfileMenu(!showProfileMenu);
    };

    const handleMobileMenuClick = () => {
        setShowProfileMenu(false);
        setShowMobileMenu(!showMobileMenu);
    };

    const { auth } = usePage().props as any;

    return (
        <div className="flex items-center">
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
                <div className="hidden sm:block">
                    <DarkModeButton darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                </div>

                <NotificationButton count={3} />
                <MessageButton count={5} />

                <div className="relative hidden md:block">
                    <button
                        onClick={handleProfileClick}
                        className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <img
                            src={auth?.user?.avatar}
                            alt={auth?.user?.name}
                            className="h-8 w-8 rounded-full object-cover"
                        />
                        <span
                            className={`absolute -right-1 -bottom-1 h-3 w-3 rounded-full border-2 border-white ${
                                showProfileMenu ? 'bg-blue-500' : 'bg-gray-400'
                            }`}
                        ></span>
                    </button>
                </div>

                {isMobile && (
                    <div className="ml-1">
                        <MobileMenuButton showMobileMenu={showMobileMenu} setShowMobileMenu={handleMobileMenuClick} />
                    </div>
                )}
            </div>
        </div>
    );
}
