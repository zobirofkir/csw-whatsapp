import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function ProfileLink() {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="flex items-center space-x-2">
            <img
                src={auth?.user?.avatar?.startsWith('http') ? auth.user.avatar : auth.user.avatar ? `/storage/${auth.user.avatar}` : undefined}
                alt={auth?.user?.name ?? 'Profile'}
                className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-black dark:text-white">{auth?.user?.name}</span>
        </div>
    );
}
