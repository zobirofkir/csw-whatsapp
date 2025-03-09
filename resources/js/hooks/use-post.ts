import { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import type { Comment, Post, ReactionCounts } from '../types/types';

export function usePost(post: Post) {
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
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('input') || target.closest('a') || target.closest('.interactive-element')) {
            return;
        }

        if (!window.location.pathname.includes(`/posts/${post.id}`)) {
            router.visit(`/posts/${post.id}`);
        }
    };

    const handleDeletePost = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            await axios.delete(`/posts/${post.id}`);
            if (window.location.pathname.includes(`/posts/${post.id}`)) {
                router.visit('/');
            } else {
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
        e.stopPropagation();

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

    return {
        states: {
            comments,
            showComments,
            newComment,
            isSubmitting,
            showReactionPicker,
            userReaction,
            reactionCounts,
            reactionPickerRef,
            replyingTo,
            replyContents,
            loadingCommentReaction,
            sendingReply,
            showMenu,
            showShareDialog,
        },
        actions: {
            setShowComments,
            setNewComment,
            setShowReactionPicker,
            setShowMenu,
            setShowShareDialog,
            setReplyingTo,
            setReplyContents,
        },
        handlers: {
            handleReaction,
            handleComment,
            handleCommentReaction,
            handleReply,
            handlePostClick,
            handleDeletePost,
            handleShare,
            copyToClipboard,
        },
        utils: {
            formatTimestamp,
        },
    };
}
