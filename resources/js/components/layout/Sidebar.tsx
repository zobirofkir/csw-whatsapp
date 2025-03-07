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
    );
}

function SidebarLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <Link href={href} className="flex items-center space-x-2 rounded-lg p-2 font-medium text-gray-700 dark:text-white">
            <span>{children}</span>
        </Link>
    );
}
