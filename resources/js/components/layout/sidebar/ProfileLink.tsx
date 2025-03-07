import { usePage } from '@inertiajs/react';

export default function ProfileLink() {
    const { auth } = usePage().props as any;

    return (
        <div className="flex items-center space-x-2">
            <img src={auth?.user?.avatar} alt="Profile" className="h-8 w-8 rounded-full" />
            <span className="text-black dark:text-white">{auth?.user?.name}</span>
        </div>
    );
}
