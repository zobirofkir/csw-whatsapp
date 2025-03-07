import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

interface MediaItem {
    id: number;
    url: string;
    type: 'image' | 'video';
}

interface Comment {
    id: number;
    content: string;
    user: {
        name: string;
        avatar: string;
    };
    timestamp: string;
}

interface ReactionCounts {
    [key: string]: number;
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
        hasReacted: boolean;
        userReaction?: string;
        reactionCounts: ReactionCounts;
        comments: Comment[];
    };
}

const REACTIONS = {
    like: '👍',
    love: '❤️',
    haha: '😂',
    wow: '😮',
    sad: '😢',
    angry: '😠',
};

export default function Post({ post }: PostProps) {
    const [likes, setLikes] = useState(post.likes);
    const [hasReacted, setHasReacted] = useState(post.hasReacted);
    const [comments, setComments] = useState(post.comments);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const [userReaction, setUserReaction] = useState<string | undefined>(post.userReaction);
    const [reactionCounts, setReactionCounts] = useState<ReactionCounts>(post.reactionCounts);
    const reactionPickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (reactionPickerRef.current && !reactionPickerRef.current.contains(event.target as Node)) {
                setShowReactionPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const displayedMedia = post.media?.slice(0, 4);
    const remainingMedia = post.media ? post.media.length - 4 : 0;

    const handleReaction = async (type: string) => {
        try {
            const currentReaction = userReaction;
            const currentCounts = { ...reactionCounts };

            if (currentReaction === type) {
                setUserReaction(undefined);
                setReactionCounts((prev) => ({
                    ...prev,
                    [type]: Math.max((prev[type] || 0) - 1, 0),
                }));
            } else {
                if (currentReaction) {
                    setReactionCounts((prev) => ({
                        ...prev,
                        [currentReaction]: Math.max((prev[currentReaction] || 0) - 1, 0),
                    }));
                }
                setUserReaction(type);
                setReactionCounts((prev) => ({
                    ...prev,
                    [type]: (prev[type] || 0) + 1,
                }));
            }

            const response = await axios.post(`/posts/${post.id}/react`, { type });

            setReactionCounts(response.data.reactionCounts);
            setUserReaction(response.data.userReaction);
            setShowReactionPicker(false);
        } catch (error) {
            console.error('Error setting reaction:', error);
            setReactionCounts(currentCounts);
            setUserReaction(currentReaction);
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await axios.post(`/posts/${post.id}/comment`, {
                content: newComment,
            });
            setComments([response.data.comment, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mb-4 overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800">
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <img src={post.user.avatar} alt={post.user.name} className="h-10 w-10 rounded-full" />
                        <div className="ml-2">
                            <h3 className="text-[15px] font-semibold text-[#050505] hover:underline dark:text-white">{post.user.name}</h3>
                            <div className="flex items-center text-[13px] text-[#65676B] dark:text-gray-400">
                                <span>{post.user.timestamp}</span>
                                <span className="mx-1">·</span>
                                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 16 16">
                                    <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14A6 6 0 118 2a6 6 0 010 12z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <button className="rounded-full p-2 hover:bg-[#F0F2F5] dark:hover:bg-gray-700">
                        <svg className="h-5 w-5 text-[#65676B]" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                    </button>
                </div>

                <p className="mt-3 text-[15px] whitespace-pre-wrap text-[#050505] dark:text-white">{post.content}</p>
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

            <div className="px-4 py-1">
                <div className="flex items-center justify-between border-b border-[#CED0D4] pb-2 text-[15px] text-[#65676B] dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="flex -space-x-1">
                            {Object.entries(reactionCounts)
                                .filter(([_, count]) => count > 0)
                                .map(([type], index) => (
                                    <div
                                        key={type}
                                        className="flex h-[22px] w-[22px] transform items-center justify-center rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)] ring-2 ring-white transition-transform hover:scale-110 dark:bg-gray-800"
                                    >
                                        {REACTIONS[type as keyof typeof REACTIONS]}
                                    </div>
                                ))}
                        </div>
                        <span className="ml-2 cursor-pointer text-[#65676B] hover:underline">
                            {Object.values(reactionCounts).reduce((a, b) => a + b, 0)}
                        </span>
                    </div>
                    <span className="cursor-pointer text-[#65676B] hover:underline">{comments.length} comments</span>
                </div>
            </div>

            <div className="px-4 py-1">
                <div className="flex border-b border-[#CED0D4] dark:border-gray-700">
                    <div className="relative flex-1">
                        <button
                            onClick={() => setShowReactionPicker(!showReactionPicker)}
                            onMouseEnter={() => setShowReactionPicker(true)}
                            className={`group flex w-full items-center justify-center space-x-2 rounded-lg py-2 hover:bg-[#F0F2F5] dark:hover:bg-gray-700 ${
                                userReaction ? 'text-[#1B74E4]' : 'text-[#65676B]'
                            }`}
                        >
                            <span className="text-xl transition-transform group-hover:scale-125">
                                {userReaction ? REACTIONS[userReaction as keyof typeof REACTIONS] : '👍'}
                            </span>
                            <span className="font-semibold">Like</span>
                        </button>

                        {showReactionPicker && (
                            <div
                                ref={reactionPickerRef}
                                onMouseLeave={() => setShowReactionPicker(false)}
                                className="absolute bottom-full left-0 mb-2 flex space-x-1 rounded-full bg-white p-1 shadow-[0_0_8px_rgba(0,0,0,0.2)] transition-all duration-200 dark:bg-gray-700"
                            >
                                {Object.entries(REACTIONS).map(([type, emoji]) => (
                                    <button
                                        key={type}
                                        onClick={() => handleReaction(type)}
                                        className={`transform cursor-pointer rounded-full p-2 text-3xl transition hover:scale-125 ${
                                            userReaction === type ? 'scale-110' : ''
                                        }`}
                                        title={type}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex flex-1 items-center justify-center space-x-2 rounded-lg py-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                        </svg>
                        <span className="font-semibold">Comment</span>
                    </button>
                    <button className="flex flex-1 items-center justify-center space-x-2 rounded-lg py-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
                        </svg>
                        <span className="font-semibold">Share</span>
                    </button>
                </div>
            </div>

            {showComments && (
                <div className="px-4 py-2">
                    <form onSubmit={handleComment} className="mb-4 flex items-center space-x-2">
                        <img src={post.user.avatar} alt="Your avatar" className="h-8 w-8 rounded-full" />
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 rounded-full bg-gray-100 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700"
                        />
                    </form>

                    <div className="space-y-3">
                        {comments.map((comment) => (
                            <div key={comment.id} className="flex space-x-2">
                                <img src={comment.user.avatar} alt={comment.user.name} className="h-8 w-8 rounded-full" />
                                <div>
                                    <div className="rounded-2xl bg-gray-100 px-3 py-2 dark:bg-gray-700">
                                        <p className="text-sm font-semibold">{comment.user.name}</p>
                                        <p className="text-sm">{comment.content}</p>
                                    </div>
                                    <div className="mt-1 flex space-x-3 text-xs text-gray-500">
                                        <button className="font-semibold hover:underline">Like</button>
                                        <button className="font-semibold hover:underline">Reply</button>
                                        <span>{comment.timestamp}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
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
