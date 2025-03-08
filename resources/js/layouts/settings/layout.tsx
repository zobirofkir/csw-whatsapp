import { Separator } from '@/components/ui/separator';
import { type PropsWithChildren } from 'react';


export default function SettingsLayout({ children }: PropsWithChildren) {

    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="px-4 py-8 max-w-7xl mx-auto">

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-8">

                <Separator className="my-6 md:hidden" />

                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
}
