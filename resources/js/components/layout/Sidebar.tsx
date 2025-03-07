import { Link } from '@inertiajs/react';
import { type ReactNode } from 'react';
import FriendsLink from './sidebar/FriendsLink';
import ProfileLink from './sidebar/ProfileLink';

interface SidebarProps {
    isMobile: boolean;
    showMobileMenu: boolean;
}

export default function Sidebar({ isMobile, showMobileMenu }: SidebarProps) {
    return (
        <div
            className={`${
                isMobile ? (showMobileMenu ? 'bg-opacity-50 fixed inset-0 z-50 bg-gray-900' : 'hidden') : 'fixed left-0 w-1/4'
            } h-screen overflow-y-auto pt-4 pl-4 md:block`}
        >
            <div className="space-y-2 rounded-lg bg-white p-4 dark:bg-gray-800">
                <SidebarLink href="/profile">
                    <ProfileLink />
                </SidebarLink>
                <SidebarLink href="/friends">
                    <FriendsLink />
                </SidebarLink>
            </div>
        </div>
    );
}

function SidebarLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <Link href={href} className="flex items-center space-x-2 rounded-lg p-2 font-medium text-gray-700 hover:bg-gray-200">
            <span>{children}</span>
        </Link>
    );
}
