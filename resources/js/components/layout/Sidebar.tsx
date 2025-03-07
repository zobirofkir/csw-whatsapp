import { Link } from '@inertiajs/react';
import { type ReactNode } from 'react';
import FeedLink from './sidebar/FeedLink';
import FriendsLink from './sidebar/FriendsLink';
import GamingLink from './sidebar/GamingLink';
import GroupsLink from './sidebar/GroupsLink';
import MarketplaceLink from './sidebar/MarketplaceLink';
import ProfileLink from './sidebar/ProfileLink';
import WatchLink from './sidebar/WatchLink';

interface SidebarProps {
    isMobile: boolean;
    showMobileMenu: boolean;
}

export default function Sidebar({ isMobile, showMobileMenu }: SidebarProps) {
    return (
        <>
            {/* Overlay */}
            {isMobile && showMobileMenu && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setShowMobileMenu(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 z-50 h-screen overflow-y-auto bg-white transition-all duration-300 ease-in-out dark:bg-gray-800 ${
                    isMobile
                        ? `w-[280px] ${showMobileMenu ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`
                        : 'left-0 w-1/4 translate-x-0 border-r border-gray-200 dark:border-gray-700'
                } pt-[72px] pb-20`}
            >
                <div className="space-y-1 px-3">
                    <SidebarLink href="/settings/profile">
                        <ProfileLink />
                    </SidebarLink>
                    <SidebarLink href="/friends">
                        <FriendsLink />
                    </SidebarLink>
                    <SidebarLink href="/feed">
                        <FeedLink />
                    </SidebarLink>
                    <SidebarLink href="/watch">
                        <WatchLink />
                    </SidebarLink>
                    <SidebarLink href="/marketplace">
                        <MarketplaceLink />
                    </SidebarLink>
                    <SidebarLink href="/groups">
                        <GroupsLink />
                    </SidebarLink>
                    <SidebarLink href="/gaming">
                        <GamingLink />
                    </SidebarLink>
                </div>
            </div>
        </>
    );
}

function SidebarLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <Link
            href={href}
            className="flex items-center space-x-3 rounded-lg p-3 font-medium text-gray-700 transition-colors hover:bg-gray-100 active:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700/50 dark:active:bg-gray-700"
        >
            <span>{children}</span>
        </Link>
    );
}
