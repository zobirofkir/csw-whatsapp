import { router } from '@inertiajs/react';
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
    reactions: {
        type: string;
        count: number;
    }[];
    userReaction?: string;
    replies: Comment[];
    parent_id?: number;
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
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyContents, setReplyContents] = useState<Record<number, string>>({});
    const [loadingReaction, setLoadingReaction] = useState<string | null>(null);
    const [loadingCommentReaction, setLoadingCommentReaction] = useState<number | null>(null);
    const [sendingReply, setSendingReply] = useState<number | null>(null);

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
            setLoadingReaction(type);
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
        } finally {
            setLoadingReaction(null);
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

    const handleCommentReaction = async (commentId: number) => {
        try {
            setLoadingCommentReaction(commentId);
            setComments(
                comments.map((comment) => {
                    if (comment.id === commentId) {
                        const currentReaction = comment.userReaction;
                        const likeReaction = comment.reactions.find((r) => r.type === 'like');
                        const newCount = currentReaction ? (likeReaction?.count || 1) - 1 : (likeReaction?.count || 0) + 1;

                        return {
                            ...comment,
                            reactions: [{ type: 'like', count: newCount }],
                            userReaction: currentReaction ? undefined : 'like',
                        };
                    }
                    return comment;
                }),
            );

            const response = await axios.post(`/comments/${commentId}/react`, { type: 'like' });

            setComments(
                comments.map((comment) => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            reactions: response.data.reactions,
                            userReaction: response.data.userReaction,
                        };
                    }
                    return comment;
                }),
            );
        } catch (error) {
            console.error('Error reacting to comment:', error);
        } finally {
            setLoadingCommentReaction(null);
        }
    };

    const handleReply = async (commentId: number) => {
        const replyContent = replyContents[commentId];
        if (!replyContent?.trim() || isSubmitting) return;

        setSendingReply(commentId);
        setIsSubmitting(true);

        const tempReply = {
            id: Date.now(),
            content: replyContent,
            user: {
                name: post.user.name,
                avatar: post.user.avatar,
            },
            timestamp: 'Just now',
            reactions: [],
            replies: [],
            parent_id: commentId,
        };

        setComments(
            comments.map((comment) => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        replies: [tempReply, ...comment.replies],
                    };
                }
                return comment;
            }),
        );

        try {
            const response = await axios.post(`/comments/${commentId}/reply`, {
                content: replyContent,
            });

            setComments(
                comments.map((comment) => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            replies: [response.data.reply, ...comment.replies.filter((r) => r.id !== tempReply.id)],
                        };
                    }
                    return comment;
                }),
            );

            setReplyContents((prev) => {
                const updated = { ...prev };
                delete updated[commentId];
                return updated;
            });
            setReplyingTo(null);
        } catch (error) {
            console.error('Error posting reply:', error);
            setComments(
                comments.map((comment) => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            replies: comment.replies.filter((r) => r.id !== tempReply.id),
                        };
                    }
                    return comment;
                }),
            );
        } finally {
            setIsSubmitting(false);
            setSendingReply(null);
        }
    };

    const renderComment = (comment: Comment, isReply = false) => (
        <div key={comment.id} className={`flex space-x-2 ${isReply ? 'mt-2 ml-8' : ''} animate-fadeIn`}>
            <img src={comment.user.avatar ? `/storage/${comment.user.avatar}` : undefined} alt={comment.user.name} className="h-8 w-8 rounded-full" />
            <div className="flex-1">
                <div className="rounded-2xl bg-gray-100 px-3 py-2 dark:bg-gray-700">
                    <p className="text-sm font-semibold">{comment.user.name}</p>
                    <p className="text-sm">{comment.content}</p>
                </div>
                <div className="mt-1 flex space-x-3 text-xs text-gray-500">
                    {!isReply && (
                        <>
                            <button
                                onClick={() => handleCommentReaction(comment.id)}
                                className={`relative font-semibold hover:underline ${comment.userReaction ? 'text-blue-500' : ''}`}
                                disabled={loadingCommentReaction === comment.id}
                            >
                                <span className={loadingCommentReaction === comment.id ? 'opacity-0' : ''}>
                                    Like {comment.reactions?.find((r) => r.type === 'like')?.count || 0}
                                </span>
                                {loadingCommentReaction === comment.id && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                                    </div>
                                )}
                            </button>
                            <button
                                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                className="font-semibold hover:underline"
                            >
                                Reply
                            </button>
                        </>
                    )}
                    <span>{comment.timestamp}</span>
                </div>

                {replyingTo === comment.id && (
                    <div className="animate-slideDown mt-2">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleReply(comment.id);
                            }}
                            className="flex items-center space-x-2"
                        >
                            <img
                                src={post.user.avatar ? `/storage/${post.user.avatar}` : undefined}
                                alt="Your avatar"
                                className="h-6 w-6 rounded-full"
                            />
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={replyContents[comment.id] || ''}
                                    onChange={(e) =>
                                        setReplyContents((prev) => ({
                                            ...prev,
                                            [comment.id]: e.target.value,
                                        }))
                                    }
                                    placeholder="Write a reply..."
                                    className="w-full rounded-full bg-gray-100 px-4 py-2 pr-12 text-sm transition-colors duration-200 focus:bg-gray-50 focus:outline-none dark:bg-gray-700 dark:focus:bg-gray-600"
                                    disabled={sendingReply === comment.id}
                                />
                                {sendingReply === comment.id ? (
                                    <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                                    </div>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={!replyContents[comment.id]?.trim()}
                                        className="absolute top-1/2 right-2 -translate-y-1/2 text-blue-500 disabled:opacity-50"
                                    >
                                        <svg className="h-6 w-6 rotate-90" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                {comment.replies?.length > 0 && <div className="mt-2">{comment.replies.map((reply) => renderComment(reply, true))}</div>}
            </div>
        </div>
    );

    const handlePostClick = (e: React.MouseEvent) => {
        // Don't navigate if clicking on buttons or interactive elements
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('input') || target.closest('a') || target.closest('.interactive-element')) {
            return;
        }

        // Only navigate if we're not already on the post page
        if (!window.location.pathname.includes(`/posts/${post.id}`)) {
            router.visit(`/posts/${post.id}`);
        }
    };

    return (
        <div
            className="mb-4 cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition-shadow duration-200 hover:shadow-md dark:bg-gray-800"
            onClick={handlePostClick}
        >
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="group flex cursor-pointer items-center">
                        <div className="relative">
                            <img
                                src={post.user.avatar ? `/storage/${post.user.avatar}` : undefined}
                                alt={post.user.name}
                                className="h-10 w-10 rounded-full ring-2 ring-transparent ring-offset-2 transition-all duration-200 group-hover:ring-blue-100"
                            />
                            <div className="absolute -right-1 -bottom-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500"></div>
                        </div>
                        <div className="ml-2">
                            <h3 className="text-[15px] font-semibold text-[#050505] transition-colors duration-200 group-hover:text-blue-500 dark:text-white">
                                {post.user.name}
                            </h3>
                            <div className="flex items-center text-[13px] text-[#65676B] dark:text-gray-400">
                                <span>{post.user.timestamp}</span>
                                <span className="mx-1">·</span>
                                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 16 16">
                                    <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14A6 6 0 118 2a6 6 0 010 12z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <button className="rounded-full p-2 text-[#65676B] transition-colors duration-200 hover:bg-[#F0F2F5] dark:hover:bg-gray-700">
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                    </button>
                </div>

                <p className="mt-3 text-[15px] leading-relaxed whitespace-pre-wrap text-[#050505] dark:text-white">{post.content}</p>
            </div>

            {post.media && post.media.length > 0 && (
                <div className="border-t border-gray-100 dark:border-gray-700">
                    <div className={`grid ${getMediaGridClass(post.media.length)} gap-[2px]`}>
                        {displayedMedia.map((media, index) => (
                            <div
                                key={media.id}
                                className={`relative overflow-hidden ${getMediaAspectClass(post.media.length, index)} group cursor-pointer`}
                            >
                                {media.type === 'image' ? (
                                    <img
                                        src={media.url}
                                        alt="Post content"
                                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="relative h-full w-full">
                                        <video className="h-full w-full object-cover" poster={media.url.replace('.mp4', '-thumbnail.jpg')}>
                                            <source src={media.url} type="video/mp4" />
                                        </video>
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors duration-200 group-hover:bg-black/30">
                                            <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                                {index === 3 && remainingMedia > 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-200 group-hover:bg-black/60">
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
                    <div className="group flex cursor-pointer items-center">
                        <div className="flex -space-x-1 transition-transform duration-200 group-hover:scale-105">
                            {Object.entries(reactionCounts)
                                .filter(([_, count]) => count > 0)
                                .map(([type], index) => (
                                    <div
                                        key={type}
                                        className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)] ring-2 ring-white transition-transform dark:bg-gray-800"
                                        style={{ zIndex: 1000 - index }}
                                    >
                                        {REACTIONS[type as keyof typeof REACTIONS]}
                                    </div>
                                ))}
                        </div>
                        <span className="ml-2 group-hover:underline">{Object.values(reactionCounts).reduce((a, b) => a + b, 0)}</span>
                    </div>
                    <button onClick={() => setShowComments(!showComments)} className="hover:underline">
                        {comments.length} comments
                    </button>
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
                <div className="animate-fadeIn px-4 py-2">
                    <form onSubmit={handleComment} className="mb-4 flex items-center space-x-2">
                        <img src={post.user.avatar ? `/storage/${post.user.avatar}` : undefined} alt="Your avatar" className="h-8 w-8 rounded-full" />
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full rounded-full bg-gray-100 px-4 py-2 pr-12 text-sm transition-colors duration-200 focus:bg-gray-50 focus:outline-none dark:bg-gray-700 dark:focus:bg-gray-600"
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim() || isSubmitting}
                                className="absolute top-1/2 right-2 -translate-y-1/2 text-blue-500 disabled:opacity-50"
                            >
                                <svg className="h-6 w-6 rotate-90" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                </svg>
                            </button>
                        </div>
                    </form>

                    <div className="space-y-3">{comments.map((comment) => renderComment(comment))}</div>
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
