import Navbar from '@/components/layout/Navbar';
import RightSidebar from '@/components/layout/RightSidebar';
import Sidebar from '@/components/layout/Sidebar';
import { type BreadcrumbItem } from '@/types';
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
        if (isDark) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setDarkMode(false);
            document.documentElement.classList.remove('dark');
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
        <div className="min-h-screen bg-[#F0F2F5] transition-colors duration-200 dark:bg-[#18191A]">
            <Navbar
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                isMobile={isMobile}
                showMobileMenu={showMobileMenu}
                setShowMobileMenu={setShowMobileMenu}
            />

            <div className="pt-16">
                <div className="flex justify-between">
                    <Sidebar isMobile={isMobile} showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} />
                    <main className="mx-auto w-full max-w-[744px] px-4 py-4">{children}</main>
                    <RightSidebar />
                </div>
            </div>
        </div>
    );
}
