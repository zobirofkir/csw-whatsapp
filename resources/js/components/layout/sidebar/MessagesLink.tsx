export default function MessagesLink({ count }: { count: number }) {
    return (
        <div className="flex w-full items-center justify-between gap-2 md:hidden block">
            <div className="flex items-center space-x-2">
                <svg className="h-6 w-6 dark:text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.913 1.454 5.512 3.726 7.21V22l3.405-1.869c.909.252 1.871.388 2.869.388 5.523 0 10-4.145 10-9.259C22 6.146 17.523 2 12 2zm1.008 12.461l-2.544-2.714-4.968 2.714 5.464-5.79 2.604 2.714 4.908-2.714-5.464 5.79z" />
                </svg>
                <span className="text-black dark:text-white">Messages</span>
            </div>
            {count > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">{count}</span>}
        </div>
    );
}
