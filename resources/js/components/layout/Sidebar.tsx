import { Link } from '@inertiajs/react';
import { type ReactNode } from 'react';
import FeedLink from './sidebar/FeedLink';
import FriendsLink from './sidebar/FriendsLink';
import GamingLink from './sidebar/GamingLink';
import GroupsLink from './sidebar/GroupsLink';
import MarketplaceLink from './sidebar/MarketplaceLink';
import MessagesLink from './sidebar/MessagesLink';
import NotificationsLink from './sidebar/NotificationsLink';
import ProfileLink from './sidebar/ProfileLink';
import WatchLink from './sidebar/WatchLink';
import { FaSignOutAlt } from 'react-icons/fa';

interface SidebarProps {
    isMobile: boolean;
    showMobileMenu: boolean;
    setShowMobileMenu: (show: boolean) => void;
}

export default function Sidebar({ isMobile, showMobileMenu, setShowMobileMenu }: SidebarProps) {
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
            <div className='md:hidden block'>
                <div
                    className={`fixed top-0 z-50 h-screen overflow-y-auto bg-white transition-all duration-300 ease-in-out dark:bg-gray-800 ${
                        isMobile
                            ? `w-full ${showMobileMenu ? 'translate-x-0 left-0 shadow-2xl' : '-translate-x-full ml-[-100%]'}`
                            : 'left-0 hidden w-[300px] translate-x-0 border-r border-gray-200 lg:block dark:border-gray-700'
                    } pt-[72px] pb-20`}
                >
                    {isMobile && (
                        <button
                            onClick={() => setShowMobileMenu(false)}
                            className="absolute right-4 top-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
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
                            <div className='flex items-center gap-2'>
                                <FaSignOutAlt />
                                <span>Logout</span>
                            </div>
                        </SidebarLink>
                    </div>
                </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="fixed left-0 hidden h-screen w-1/4 overflow-y-auto pt-4 pr-4 lg:block">
                <div className="mb-4 rounded-lg bg-white p-4 shadow dark:bg-gray-800">
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
