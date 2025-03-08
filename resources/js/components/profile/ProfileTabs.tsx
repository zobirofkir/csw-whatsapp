export default function ProfileTabs() {
    return (
        <div className="mt-1 border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-1">
                <a
                    href="#"
                    className="border-b-[3px] border-blue-600 px-4 py-4 text-[15px] font-semibold text-blue-600"
                    aria-current="page"
                >
                    Posts
                </a>
                <a
                    href="#"
                    className="px-4 py-4 text-[15px] font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                    About
                </a>
                <a
                    href="#"
                    className="px-4 py-4 text-[15px] font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                    Friends
                </a>
                <a
                    href="#"
                    className="px-4 py-4 text-[15px] font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                    Photos
                </a>
                <a
                    href="#"
                    className="px-4 py-4 text-[15px] font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                    Videos
                </a>
            </nav>
        </div>
    );
}
