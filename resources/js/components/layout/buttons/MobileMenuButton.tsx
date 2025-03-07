interface MobileMenuButtonProps {
    showMobileMenu: boolean;
    setShowMobileMenu: (show: boolean) => void;
}

export default function MobileMenuButton({ showMobileMenu, setShowMobileMenu }: MobileMenuButtonProps) {
    return (
        <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
            <svg className="h-6 w-6 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
    );
}
