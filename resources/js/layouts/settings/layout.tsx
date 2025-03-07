import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        url: '/settings/profile',
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

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-16 mt-8">
                <aside className="w-full lg:w-64">
                    <nav className="flex flex-col space-y-2 sticky top-8">
                        {sidebarNavItems.map((item) => (
                            <Button
                                key={item.url}
                                size="sm"
                                variant={currentPath === item.url ? "secondary" : "ghost"}
                                asChild
                                className={cn('w-full justify-start text-sm font-medium', {
                                    'bg-neutral-100 dark:bg-neutral-800': currentPath === item.url,
                                })}
                            >
                                <Link href={item.url} prefetch className="py-2">
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 lg:max-w-3xl">
                    <section className="space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
