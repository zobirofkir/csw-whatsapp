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
                    className={`fixed inset-y-0 left-0 z-50 w-72 transform overflow-y-auto bg-white transition-transform duration-300 ease-in-out dark:bg-gray-800 ${
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
            <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto rounded-lg bg-white shadow-sm dark:bg-gray-800">
                <nav className="space-y-1 p-4">
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

function SidebarLink({ href, children, method, as }: { href: string; children: ReactNode; method?: string; as?: string }) {
    return (
        <Link
            href={href}
            method={method}
            className="flex items-center space-x-3 rounded-lg p-3 font-medium text-gray-700 transition-colors hover:bg-gray-100 active:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700/50 dark:active:bg-gray-700"
        >
            <span>{children}</span>
        </Link>
    );
}
