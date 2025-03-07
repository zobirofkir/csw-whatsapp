interface PostActionButtonProps {
    icon: 'photo' | 'emoji';
    text: string;
    onClick?: () => void;
}

export function PostActionButton({ icon, text, onClick }: PostActionButtonProps) {
    const icons = {
        photo: (
            <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </svg>
        ),
        emoji: (
            <svg className="h-6 w-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
        ),
    };

    return (
        <button
            className="flex flex-1 items-center justify-center space-x-2 rounded-lg py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onClick}
        >
            {icons[icon]}
            <span className="font-medium text-gray-600 dark:text-gray-300">{text}</span>
        </button>
    );
}
