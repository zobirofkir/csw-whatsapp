interface MediaItem {
    id: number;
    url: string;
    type: 'image' | 'video';
}

interface PostProps {
    post: {
        id: number;
        user: {
            name: string;
            avatar: string;
            timestamp: string;
        };
        content: string;
        media: MediaItem[];
        likes: number;
        comments: number;
    };
}

export default function Post({ post }: PostProps) {
    const displayedMedia = post.media?.slice(0, 4);
    const remainingMedia = post.media ? post.media.length - 4 : 0;

    return (
        <div className="mb-3 rounded-lg bg-white shadow-sm dark:bg-gray-800">
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <img src={post.user.avatar} alt={post.user.name} className="h-10 w-10 rounded-full border border-gray-200" />
                        <div>
                            <h3 className="text-[15px] font-semibold text-gray-900 hover:underline dark:text-white">{post.user.name}</h3>
                            <div className="flex items-center text-[13px] text-gray-500 dark:text-gray-400">
                                <span>{post.user.timestamp}</span>
                                <span className="mx-1">·</span>
                                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M12 8a4 4 0 11-8 0 4 4 0 018 0zM8 0a8 8 0 100 16A8 8 0 008 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <svg className="h-6 w-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                    </button>
                </div>
                <p className="mt-4 text-[15px] text-gray-900 dark:text-white">{post.content}</p>
            </div>

            {post.media && post.media.length > 0 && (
                <div className="border-t border-gray-100 dark:border-gray-700">
                    <div className={`grid ${getMediaGridClass(post.media.length)} gap-1`}>
                        {displayedMedia.map((media, index) => (
                            <div key={media.id} className={`relative ${getMediaAspectClass(post.media.length, index)}`}>
                                {media.type === 'image' ? (
                                    <img src={media.url} alt="Post content" className="h-full w-full object-cover" />
                                ) : (
                                    <video controls className="h-full w-full object-cover">
                                        <source src={media.url} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                                {index === 3 && remainingMedia > 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                        <span className="text-2xl font-semibold text-white">+{remainingMedia}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="px-4">
                <div className="flex items-center justify-between border-b border-gray-100 py-2.5 text-[15px] text-gray-500 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                        <span className="flex items-center">
                            <img
                                className="h-[18px]"
                                src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%2318AFFF'/%3e%3cstop offset='100%25' stop-color='%230062DF'/%3e%3c/linearGradient%3e%3c/defs%3e%3cg fill='none'%3e%3cpath fill='url(%23a)' d='M8 0a8 8 0 100 16A8 8 0 008 0z'/%3e%3cpath fill='white' d='M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725a.73.73 0 01.089.546c-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666z'/%3e%3c/g%3e%3c/svg%3e"
                                alt=""
                            />
                            <span className="ml-1">{post.likes}</span>
                        </span>
                    </div>
                    <span className="cursor-pointer text-gray-500 hover:underline dark:text-gray-400">{post.comments} comments</span>
                </div>
                <PostActions />
            </div>
        </div>
    );
}

function getMediaGridClass(totalMedia: number): string {
    switch (Math.min(totalMedia, 4)) {
        case 1:
            return 'grid-cols-1';
        case 2:
            return 'grid-cols-2';
        case 3:
            return 'grid-cols-2';
        case 4:
            return 'grid-cols-2';
        default:
            return 'grid-cols-1';
    }
}

function getMediaAspectClass(totalMedia: number, index: number): string {
    if (totalMedia === 1) return 'aspect-[16/9]';
    if (totalMedia === 2) return 'aspect-square';
    if (totalMedia === 3 && index === 0) return 'aspect-[16/9] col-span-2';
    if (totalMedia === 3) return 'aspect-square';
    if (totalMedia === 4) return 'aspect-square';
    return 'aspect-square';
}

function PostActions() {
    return (
        <div className="flex justify-between py-1">
            <ActionButton icon="like" text="Like" />
            <ActionButton icon="comment" text="Comment" />
            <ActionButton icon="share" text="Share" />
        </div>
    );
}

function ActionButton({ icon, text }: { icon: string; text: string }) {
    const iconMap = {
        like: (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1.5 12.5h3a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5zm9.147-5.992c1.381-.239 2.345.154 2.871 1.178.526 1.024.526 2.287 0 3.793l-.25.61h4.365c1.035 0 1.905.74 1.949 1.715l.006.14v.608a3.314 3.314 0 0 1-.46 1.698l-2.052 3.774a1.59 1.59 0 0 1-1.352.828h-7.111a.505.505 0 0 1-.501-.505V9.556c0-.272.199-.49.454-.505z" />
            </svg>
        ),
        comment: (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1.5 12.5v-7a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-3.293l-3.207 3.207-3.207-3.207H2a.5.5 0 0 1-.5-.5z" />
            </svg>
        ),
        share: (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725.1.163.132.36.089.546-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666zM3.6 7h.8a.6.6 0 0 1 .6.6v3.8a.6.6 0 0 1-.6.6h-.8a.6.6 0 0 1-.6-.6V7.6a.6.6 0 0 1 .6-.6z" />
            </svg>
        ),
    };

    return (
        <button className="flex flex-1 items-center justify-center space-x-2 rounded-lg py-2 text-[15px] font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
            {iconMap[icon as keyof typeof iconMap]}
            <span>{text}</span>
        </button>
    );
}
