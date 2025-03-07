interface StoryProps {
    id: string;
    imageUrl: string;
    userName: string;
    userAvatar: string;
}

export default function Story({ imageUrl, userName, userAvatar }: StoryProps) {
    return (
        <div className="relative cursor-pointer group min-w-[112px] w-28 sm:w-32 h-48 sm:h-52 rounded-xl overflow-hidden">
            <img
                src={imageUrl}
                alt={`${userName}'s story`}
                className="absolute w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 group-hover:from-black/40 group-hover:to-black/70 transition-opacity duration-300" />
            <div className="absolute top-4 left-4">
                <img
                    src={userAvatar}
                    alt={userName}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-4 border-blue-500 dark:border-blue-600"
                />
            </div>
            <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white text-sm sm:text-base font-medium truncate">
                    {userName}
                </p>
            </div>
        </div>
    );
}
