import { type BreadcrumbItem } from '@/types';
import { type ReactNode, useEffect, useState, lazy, Suspense } from 'react';

// Lazy load components
const Navbar = lazy(() => import('@/components/layout/Navbar'));
const Sidebar = lazy(() => import('@/components/layout/Sidebar'));
const RightSidebar = lazy(() => import('@/components/layout/RightSidebar'));

// Loading fallback component
const LoadingFallback = () => (
    <div className="flex h-16 items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-blue-600"></div>
    </div>
);

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
            <Suspense fallback={<LoadingFallback />}>
                <Navbar
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                    isMobile={isMobile}
                    showMobileMenu={showMobileMenu}
                    setShowMobileMenu={setShowMobileMenu}
                />
            </Suspense>

            <div className="pt-16">
                <div className="mx-auto flex max-w-[1920px] justify-between px-0">
                    <Suspense fallback={<LoadingFallback />}>
                        <Sidebar
                            isMobile={isMobile}
                            showMobileMenu={showMobileMenu}
                            setShowMobileMenu={setShowMobileMenu}
                        />
                    </Suspense>
                    <main className="mx-auto w-full max-w-[680px] px-4 py-4">
                        {children}
                    </main>
                    <Suspense fallback={<LoadingFallback />}>
                        <RightSidebar />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
