import { useState } from 'react';

export default function CreatePostForm() {
    const [postContent, setPostContent] = useState('');

    return (
        <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <div className="flex space-x-4">
                <img src="https://i.pravatar.cc/150?img=12" alt="Your avatar" className="h-10 w-10 rounded-full" />
                <textarea
                    className="flex-1 resize-none rounded-lg bg-gray-100 p-3 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                    placeholder="What's on your mind?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    rows={3}
                />
            </div>
            <div className="mt-4 border-t pt-4">
                <div className="flex items-center justify-between">
                    <div className="flex space-x-4">
                        <PostActionButton icon="photo" text="Photo/Video" color="green" />
                        <PostActionButton icon="emoji" text="Feeling/Activity" color="yellow" />
                    </div>
                    <button
                        className="rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
                        onClick={() => {
                            // Handle post creation
                            setPostContent('');
                        }}
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
}

function PostActionButton({ icon, text, color }: { icon: 'photo' | 'emoji'; text: string; color: string }) {
    const icons = {
        photo: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
        ),
        emoji: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        ),
    };

    return (
        <button className="flex items-center space-x-2 rounded-lg px-3 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
            <svg className={`h-6 w-6 text-${color}-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {icons[icon]}
            </svg>
            <span>{text}</span>
        </button>
    );
}
