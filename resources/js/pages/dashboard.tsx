import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const SAMPLE_POSTS = [
    {
        id: 1,
        user: {
            name: 'Sarah Johnson',
            avatar: 'https://i.pravatar.cc/150?img=1',
            timestamp: '3 hours ago',
        },
        content: 'Just finished my morning run! 🏃‍♀️ Beautiful sunrise today.',
        image: 'https://picsum.photos/seed/post1/800/600',
        likes: 234,
        comments: 56,
    },
    {
        id: 2,
        user: {
            name: 'Michael Chen',
            avatar: 'https://i.pravatar.cc/150?img=2',
            timestamp: '5 hours ago',
        },
        content: 'Check out this amazing dish I cooked! 🍝 #homechef #cooking',
        image: 'https://picsum.photos/seed/post2/800/600',
        likes: 567,
        comments: 89,
    },
    // ... add more sample posts
];

export default function Dashboard() {
    const [postContent, setPostContent] = useState('');

    return (
        <AppLayout>
            <Head title="News Feed" />

            <div className="space-y-4 py-4">
                {/* Create Post Card */}
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
                                <button className="flex items-center space-x-2 rounded-lg px-3 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                                    <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <span>Photo/Video</span>
                                </button>
                                <button className="flex items-center space-x-2 rounded-lg px-3 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                                    <svg className="h-6 w-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <span>Feeling/Activity</span>
                                </button>
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

                {/* Sample Posts */}
                {SAMPLE_POSTS.map((post) => (
                    <div key={post.id} className="rounded-lg bg-white shadow dark:bg-gray-800">
                        {/* Post Header */}
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

                        {/* Post Image */}
                        <img src={post.image} alt="Post content" className="w-full" />

                        {/* Post Actions */}
                        <div className="p-4">
                            <div className="flex items-center justify-between border-b pb-4 text-gray-500">
                                <span>{post.likes} Likes</span>
                                <span>{post.comments} Comments</span>
                            </div>
                            <div className="flex justify-between pt-4">
                                <button className="flex items-center space-x-2 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                        />
                                    </svg>
                                    <span>Like</span>
                                </button>
                                <button className="flex items-center space-x-2 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        />
                                    </svg>
                                    <span>Comment</span>
                                </button>
                                <button className="flex items-center space-x-2 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                        />
                                    </svg>
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
