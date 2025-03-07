import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'General',
        url: '/settings/profile',
        icon: null,
    },
    {
        title: 'Security and login',
        url: '/settings/security',
        icon: null,
    },
    {
        title: 'Your Facebook information',
        url: '/settings/facebook-info',
        icon: null,
    },
    {
        title: 'Privacy',
        url: '/settings/privacy',
        icon: null,
    },
    {
        title: 'Appearance',
        url: '/settings/appearance',
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="px-4 py-8 max-w-7xl mx-auto">
            <Heading title="Settings" description="Manage your profile and account settings" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-8">
                <aside className="w-full lg:w-[360px]">
                    <div className="bg-white dark:bg-[#242526] rounded-lg p-2">
                        <nav className="flex flex-col space-y-1">
                            {sidebarNavItems.map((item) => (
                                <Button
                                    key={item.url}
                                    variant="ghost"
                                    asChild
                                    className={cn(
                                        'w-full justify-start rounded-md px-2 py-1.5 text-[15px] font-medium',
                                        {
                                            'bg-[#E7F3FF] dark:bg-[#263951] text-[#1877F2] dark:text-[#4599FF]':
                                                currentPath === item.url,
                                            'text-[#050505] dark:text-[#E4E6EB] hover:bg-[#F2F2F2] dark:hover:bg-[#3A3B3C]':
                                                currentPath !== item.url,
                                        }
                                    )}
                                >
                                    <Link href={item.url} className="py-2 w-full">
                                        {item.title}
                                    </Link>
                                </Button>
                            ))}
                        </nav>
                    </div>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
}
