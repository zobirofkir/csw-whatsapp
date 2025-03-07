export default function GroupsLink() {
    return (
        <div className="flex items-center space-x-2">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-3-3h-2m-4 0H9M7 20H2v-2a3 3 0 013-3h2m4 0h4m-4 0v-2a3 3 0 013-3h2a3 3 0 013 3v2M9 7a3 3 0 110-6 3 3 0 010 6zm9 0a3 3 0 110-6 3 3 0 010 6z"
                />
            </svg>
            <span className="text-black dark:text-white">Groups</span>
        </div>
    );
}
