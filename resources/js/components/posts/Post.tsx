interface PostProps {
    post: {
        id: number;
        user: {
            name: string;
            avatar: string;
            timestamp: string;
        };
        content: string;
        image: string;
        likes: number;
        comments: number;
    };
}

export default function Post({ post }: PostProps) {
    return (
        <div className="mb-4 rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <img src={post.user.avatar} alt={post.user.name} className="h-10 w-10 rounded-full" />
                        <div>
                            <h3 className="cursor-pointer text-[15px] font-semibold text-black hover:underline dark:text-white">{post.user.name}</h3>
                            <div className="flex items-center text-[13px] text-gray-500 dark:text-gray-400">
                                <span>{post.user.timestamp}</span>
                                <span className="mx-1">·</span>
                                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM3.293 4.293a1 1 0 0 1 1.414 0L8 7.586l3.293-3.293a1 1 0 1 1 1.414 1.414L9.414 9l3.293 3.293a1 1 0 0 1-1.414 1.414L8 10.414l-3.293 3.293a1 1 0 0 1-1.414-1.414L6.586 9 3.293 5.707a1 1 0 0 1 0-1.414Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <button className="rounded-full p-2 hover:bg-gray-100">
                        <svg className="h-6 w-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                    </button>
                </div>
                <p className="mt-3 text-[15px] text-black dark:text-white">{post.content}</p>
            </div>

            {post.image && (
                <div className="border-t border-b border-gray-200 dark:border-gray-700">
                    <img src={post.image} alt="Post content" className="w-full" />
                </div>
            )}

            <div className="px-4">
                <div className="flex items-center justify-between border-b border-gray-200 py-2.5 text-[15px] text-gray-500 dark:border-gray-700">
                    <div className="flex items-center">
                        <span className="flex items-center">
                            <span className="flex h-[18px]">
                                <img
                                    className="h-[18px]"
                                    src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%2318AFFF'/%3e%3cstop offset='100%25' stop-color='%230062DF'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0 0 0 0 0 0.299356041 0 0 0 0 0.681187726 0 0 0 0.3495684 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 00-8 8 8 8 0 1016 0 8 8 0 00-8-8z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725a.73.73 0 01.089.546c-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666zM3.6 7h.8a.6.6 0 01.6.6v3.8a.6.6 0 01-.6.6h-.8a.6.6 0 01-.6-.6V7.6a.6.6 0 01.6-.6z'/%3e%3c/g%3e%3c/svg%3e"
                                    alt=""
                                />
                            </span>
                            <span className="ml-1">{post.likes}</span>
                        </span>
                    </div>
                    <span className="cursor-pointer text-gray-500 hover:underline">{post.comments} comments</span>
                </div>
                <PostActions />
            </div>
        </div>
    );
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
