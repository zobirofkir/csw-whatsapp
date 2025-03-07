import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

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
    angry: '😠'
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
            const response = await axios.post(`/posts/${post.id}/react`, { type });
            setReactionCounts(response.data.reactionCounts);
            setUserReaction(response.data.userReaction);
            setShowReactionPicker(false);
        } catch (error) {
            console.error('Error setting reaction:', error);
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await axios.post(`/posts/${post.id}/comment`, {
                content: newComment
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
                        <div className="relative">
                            <span
                                className="flex items-center cursor-pointer"
                                onClick={() => setShowReactionPicker(!showReactionPicker)}
                            >
                                {Object.entries(reactionCounts)
                                    .filter(([_, count]) => count > 0)
                                    .map(([type, count]) => (
                                        <span key={type} className="mr-1" title={`${count} ${type}`}>
                                            {REACTIONS[type as keyof typeof REACTIONS]}
                                        </span>
                                    ))}
                                <span className="ml-1">{Object.values(reactionCounts).reduce((a, b) => a + b, 0)}</span>
                            </span>

                            {showReactionPicker && (
                                <div
                                    ref={reactionPickerRef}
                                    className="absolute bottom-full left-0 mb-2 flex space-x-2 rounded-full bg-white p-2 shadow-lg dark:bg-gray-700"
                                >
                                    {Object.entries(REACTIONS).map(([type, emoji]) => (
                                        <button
                                            key={type}
                                            onClick={() => handleReaction(type)}
                                            className={`transform cursor-pointer rounded-full p-2 transition hover:scale-125 ${
                                                userReaction === type ? 'bg-gray-100 dark:bg-gray-600' : ''
                                            }`}
                                            title={type}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <span
                        onClick={() => setShowComments(!showComments)}
                        className="cursor-pointer text-gray-500 hover:underline dark:text-gray-400"
                    >
                        {comments.length} comments
                    </span>
                </div>

                <PostActions
                    onLike={() => setShowReactionPicker(!showReactionPicker)}
                    hasReacted={!!userReaction}
                    onCommentClick={() => setShowComments(!showComments)}
                    activeReaction={userReaction}
                />

                {showComments && (
                    <div className="mt-4">
                        <form onSubmit={handleComment} className="mb-4">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full rounded-lg border border-gray-200 p-2 dark:border-gray-700 dark:bg-gray-800"
                            />
                        </form>

                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <div key={comment.id} className="flex space-x-2">
                                    <img
                                        src={comment.user.avatar}
                                        alt={comment.user.name}
                                        className="h-8 w-8 rounded-full"
                                    />
                                    <div className="flex-1">
                                        <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-700">
                                            <p className="font-semibold">{comment.user.name}</p>
                                            <p>{comment.content}</p>
                                        </div>
                                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
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

function PostActions({ onLike, hasReacted, onCommentClick, activeReaction }: {
    onLike: () => void,
    hasReacted: boolean,
    onCommentClick: () => void,
    activeReaction?: string
}) {
    const getReactionEmoji = () => {
        if (!activeReaction) return '👍';
        return REACTIONS[activeReaction as keyof typeof REACTIONS] || '👍';
    };

    return (
        <div className="flex justify-between py-1">
            <button
                onClick={onLike}
                className={`flex flex-1 items-center justify-center space-x-2 rounded-lg py-2 text-[15px] font-medium ${
                    hasReacted ? 'text-blue-500' : 'text-gray-500'
                } hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
                <span className="text-xl">{getReactionEmoji()}</span>
                <span>React</span>
            </button>
            <ActionButton icon="comment" text="Comment" onClick={onCommentClick} />
            <ActionButton icon="share" text="Share" onClick={() => {}} />
        </div>
    );
}

function ActionButton({ icon, text, onClick }: { icon: string; text: string; onClick: () => void }) {
    const className = `flex flex-1 items-center justify-center space-x-2 rounded-lg py-2 text-[15px] font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700`;

    return (
        <button className={className} onClick={onClick}>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1.5 12.5h3a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5zm9.147-5.992c1.381-.239 2.345.154 2.871 1.178.526 1.024.526 2.287 0 3.793l-.25.61h4.365c1.035 0 1.905.74 1.949 1.715l.006.14v.608a3.314 3.314 0 0 1-.46 1.698l-2.052 3.774a1.59 1.59 0 0 1-1.352.828h-7.111a.505.505 0 0 1-.501-.505V9.556c0-.272.199-.49.454-.505z" />
            </svg>
            <span>{text}</span>
        </button>
    );
}
