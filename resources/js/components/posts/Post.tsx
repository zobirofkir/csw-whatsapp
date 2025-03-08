import { router } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Comment } from './Comment';
import { getMediaAspectClass, getMediaGridClass } from './mediaUtils';
import type { PostProps, ReactionCounts } from './types';
import { REACTIONS } from './types';

export default function Post({ post }: PostProps) {
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
    const [loadingCommentReaction, setLoadingCommentReaction] = useState<number | null>(null);
    const [sendingReply, setSendingReply] = useState<number | null>(null);
    const [showMenu, setShowMenu] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);

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

    const handleDeletePost = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent post click navigation

        if (!confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            await axios.delete(`/posts/${post.id}`);
            // If we're on the post's page, redirect to home
            if (window.location.pathname.includes(`/posts/${post.id}`)) {
                router.visit('/');
            } else {
                // Remove the post from the DOM
                const postElement = document.getElementById(`post-${post.id}`);
                if (postElement) {
                    postElement.remove();
                }
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent post click navigation

        const postUrl = `${window.location.origin}/posts/${post.id}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Post by ${post.user.name}`,
                    text: post.content,
                    url: postUrl,
                });
            } catch (error) {
                if ((error as Error).name !== 'AbortError') {
                    setShowShareDialog(true);
                }
            }
        } else {
            setShowShareDialog(true);
        }
    };

    const copyToClipboard = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const postUrl = `${window.location.origin}/posts/${post.id}`;

        try {
            await navigator.clipboard.writeText(postUrl);
            // You might want to show a toast notification here
            alert('Link copied to clipboard!');
            setShowShareDialog(false);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const formatTimestamp = (created_at: string) => {
        const date = new Date(created_at);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return 'Just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes}m`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h`;
        } else if (diffInSeconds < 604800) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days}d`;
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
            });
        }
    };

    return (
        <div
            id={`post-${post.id}`}
            className="mb-4 cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition-shadow duration-200 hover:shadow-md dark:bg-gray-800"
            onClick={handlePostClick}
        >
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="group flex cursor-pointer items-center">
                        <div className="relative">
                            <img
                                src={
                                    post.user.avatar?.startsWith('http')
                                        ? post.user.avatar
                                        : post.user.avatar
                                          ? `/storage/${post.user.avatar}`
                                          : undefined
                                }
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
                                <span>{formatTimestamp(post.created_at)}</span>
                                <span className="mx-1">·</span>
                                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 16 16">
                                    <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14A6 6 0 118 2a6 6 0 010 12z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    {post.user_id === window.auth?.user?.id && (
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(!showMenu);
                                }}
                                className="rounded-full p-2 text-[#65676B] transition-colors duration-200 hover:bg-[#F0F2F5] dark:hover:bg-gray-700"
                            >
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                </svg>
                            </button>

                            {showMenu && (
                                <div
                                    className="ring-opacity-5 absolute top-full right-0 mt-1 w-48 rounded-md bg-white shadow-lg ring-1 ring-black dark:bg-gray-700"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="py-1">
                                        <button
                                            onClick={handleDeletePost}
                                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                            <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                            </svg>
                                            Delete Post
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
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
                    <button
                        onClick={handleShare}
                        className="flex flex-1 items-center justify-center space-x-2 rounded-lg py-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
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
                        <img src={post.user.avatar} alt="Your avatar" className="h-8 w-8 rounded-full" />
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

                    <div className="space-y-3">
                        {comments.map((comment) => (
                            <Comment
                                key={comment.id}
                                comment={comment}
                                onReply={setReplyingTo}
                                onReaction={handleCommentReaction}
                                replyingTo={replyingTo}
                                replyContents={replyContents}
                                setReplyContents={setReplyContents}
                                handleReply={handleReply}
                                loadingCommentReaction={loadingCommentReaction}
                                sendingReply={sendingReply}
                                userAvatar={post.user.avatar}
                            />
                        ))}
                    </div>
                </div>
            )}

            {showShareDialog && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowShareDialog(false);
                    }}
                >
                    <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800" onClick={(e) => e.stopPropagation()}>
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Share Post</h3>

                        <div className="space-y-4">
                            <button
                                onClick={copyToClipboard}
                                className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                                </svg>
                                <span>Copy Link</span>
                            </button>

                            <div className="flex justify-center space-x-4">
                                <a
                                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${window.location.origin}/posts/${post.id}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:bg-opacity-90 rounded-full bg-[#1DA1F2] p-2 text-white"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                </a>

                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/posts/${post.id}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:bg-opacity-90 rounded-full bg-[#1877F2] p-2 text-white"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowShareDialog(false)}
                            className="mt-6 w-full rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
