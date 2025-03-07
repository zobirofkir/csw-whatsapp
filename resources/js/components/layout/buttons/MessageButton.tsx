interface MessageButtonProps {
    count: number;
}

export default function MessageButton({ count }: MessageButtonProps) {
    return (
        <button className="relative rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg className="h-6 w-6 dark:text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            </svg>
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {count}
            </span>
        </button>
    );
}
