interface NotificationButtonProps {
    count: number;
}

export default function NotificationButton({ count }: NotificationButtonProps) {
    return (
        <button className="relative rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg className="h-6 w-6 dark:text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {count}
            </span>
        </button>
    );
}
