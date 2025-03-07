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
        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-4">
                <div className="flex items-center space-x-3">
                    <img src={post.user.avatar} alt={post.user.name} className="h-10 w-10 rounded-full" />
                    <div>
                        <h3 className="font-semibold text-black dark:text-white">{post.user.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{post.user.timestamp}</p>
                    </div>
                </div>
                <p className="mt-3 text-black dark:text-white">{post.content}</p>
            </div>

            <img src={post.image} alt="Post content" className="w-full" />

            <div className="p-4">
                <div className="flex items-center justify-between border-b pb-4 text-gray-500">
                    <span>{post.likes} Likes</span>
                    <span>{post.comments} Comments</span>
                </div>
                <PostActions />
            </div>
        </div>
    );
}

function PostActions() {
    return (
        <div className="flex justify-between pt-4">
            <ActionButton icon="like" text="Like" />
            <ActionButton icon="comment" text="Comment" />
            <ActionButton icon="share" text="Share" />
        </div>
    );
}

function ActionButton({ icon, text }: { icon: string; text: string }) {
    // Add icon paths based on the icon prop
    return (
        <button className="flex items-center space-x-2 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
            {/* Add SVG icon here */}
            <span>{text}</span>
        </button>
    );
}
