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
        setShowProfileMenu(!showProfileMenu);
    };

    return (
        <div className="flex items-center space-x-2 md:space-x-4">
            <DarkModeButton darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <NotificationButton count={3} />
            <MessageButton count={5} />
            <button
                onClick={handleProfileClick}
                className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
                <img src="https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?cs=srgb&dl=pexels-sulimansallehi-1704488.jpg&fm=jpg" alt="Profile" className="h-8 w-8 rounded-full object-cover" />
            </button>
            {isMobile && <MobileMenuButton showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} />}
        </div>
    );
}
