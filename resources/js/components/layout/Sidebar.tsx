import { Link } from '@inertiajs/react';
import { type ReactNode } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import FeedLink from './sidebar/FeedLink';
import FriendsLink from './sidebar/FriendsLink';
import GamingLink from './sidebar/GamingLink';
import GroupsLink from './sidebar/GroupsLink';
import MarketplaceLink from './sidebar/MarketplaceLink';
import MessagesLink from './sidebar/MessagesLink';
import NotificationsLink from './sidebar/NotificationsLink';
import ProfileLink from './sidebar/ProfileLink';
import WatchLink from './sidebar/WatchLink';

interface SidebarProps {
    isMobile: boolean;
    showMobileMenu: boolean;
    setShowMobileMenu: (show: boolean) => void;
}

export default function Sidebar({ isMobile, showMobileMenu, setShowMobileMenu }: SidebarProps) {
    return (
        <>
            {/* Mobile Menu Overlay */}
            {isMobile && showMobileMenu && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setShowMobileMenu(false)}
                />
            )}

            {/* Mobile Sidebar */}
            {isMobile && (
                <div
                    className={`fixed inset-y-0 left-0 z-50 w-[280px] transform overflow-y-auto bg-white transition-transform duration-300 ease-in-out dark:bg-[#242526] ${
                        showMobileMenu ? 'translate-x-0' : '-translate-x-full'
                    }`}
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
                        <SidebarLink href="/notifications">
                            <NotificationsLink count={3} />
                        </SidebarLink>
                        <SidebarLink href="/messages">
                            <MessagesLink count={5} />
                        </SidebarLink>
                        <SidebarLink href="/logout" method="post" as="button">
                            <div className="flex items-center gap-2">
                                <FaSignOutAlt />
                                <span>Logout</span>
                            </div>
                        </SidebarLink>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <div className="sticky top-16 hidden h-[calc(100vh-4rem)] w-[360px] overflow-y-auto px-2 pt-4 lg:block">
                <nav className="space-y-1">
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
                </nav>
            </div>
        </>
    );
}

function SidebarLink({
    href,
    children,
    method = 'get',
}: {
    href: string;
    children: ReactNode;
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
}) {
    return (
        <Link
            href={href}
            method={method}
            className="flex items-center rounded-lg p-2 font-medium text-[#050505] transition-colors hover:bg-[#E4E6E9] active:bg-[#DCE0E3] dark:text-[#E4E6EB] dark:hover:bg-[#303031] dark:active:bg-[#3A3B3C]"
        >
            {children}
        </Link>
    );
}
