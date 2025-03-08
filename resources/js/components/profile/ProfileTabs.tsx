import { Link } from '@inertiajs/react';

export default function ProfileTabs() {
    return (
        <div className="mt-1 border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-1">
                <Link
                    href="/settings/profile"
                    className="border-b-[3px] border-blue-600 px-4 py-4 text-[15px] font-semibold text-blue-600"
                    aria-current="page"
                >
                    Posts
                </Link>
            </nav>
        </div>
    );
}
