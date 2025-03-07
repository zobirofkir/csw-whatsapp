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
        <div className="min-h-screen bg-neutral-100 transition-colors duration-200 dark:bg-gray-900">
            <Navbar
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                isMobile={isMobile}
                showMobileMenu={showMobileMenu}
                setShowMobileMenu={setShowMobileMenu}
            />

            <main className="pt-16">
                <div className="mx-auto grid grid-cols-1 gap-4 px-4 md:grid-cols-12 lg:px-8">
                    {/* Left Sidebar */}
                    <aside className="hidden md:col-span-3 md:block">
                        <Sidebar isMobile={isMobile} showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} />
                    </aside>

                    {/* Main Content */}
                    <div className="md:col-span-6">{children}</div>

                    {/* Right Sidebar */}
                    <aside className="hidden md:col-span-3 md:block">
                        <RightSidebar />
                    </aside>
                </div>
            </main>
        </div>
    );
}
