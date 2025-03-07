import DarkModeButton from './buttons/DarkModeButton';
import MessageButton from './buttons/MessageButton';
import MobileMenuButton from './buttons/MobileMenuButton';
import NotificationButton from './buttons/NotificationButton';
import ProfileButton from './buttons/ProfileButton';

interface NavIconsProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    isMobile: boolean;
    showMobileMenu: boolean;
    setShowMobileMenu: (show: boolean) => void;
}

export default function NavIcons({ darkMode, toggleDarkMode, isMobile, showMobileMenu, setShowMobileMenu }: NavIconsProps) {
    return (
        <div className="flex items-center space-x-2 md:space-x-4">
            <DarkModeButton darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <NotificationButton count={3} />
            <MessageButton count={5} />
            <ProfileButton />
            {isMobile && <MobileMenuButton showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} />}
        </div>
    );
}
