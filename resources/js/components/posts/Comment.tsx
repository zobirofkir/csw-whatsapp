import type { Comment as CommentType } from './types';

interface CommentProps {
    comment: CommentType;
    isReply?: boolean;
    onReply: (commentId: number | null) => void;
    replyingTo: number | null;
    replyContents: Record<number, string>;
    setReplyContents: React.Dispatch<React.SetStateAction<Record<number, string>>>;
    handleReply: (commentId: number) => void;
    sendingReply: number | null;
    userAvatar?: string;
}

export function Comment({
    comment,
    isReply = false,
    onReply,
    replyingTo,
    replyContents,
    setReplyContents,
    handleReply,
    sendingReply,
    userAvatar,
}: CommentProps) {
    return (
        <div className={`flex space-x-2 ${isReply ? 'mt-2 ml-8' : ''} animate-fadeIn`}>
            <img
                src={
                    comment.user.avatar?.startsWith('http')
                        ? comment.user.avatar
                        : comment.user.avatar
                          ? `/storage/${comment.user.avatar}`
                          : undefined
                }
                alt={comment.user.name}
                className="h-8 w-8 rounded-full"
            />
            <div className="flex-1">
                <div className="rounded-2xl bg-gray-100 px-3 py-2 dark:bg-gray-700">
                    <p className="text-sm font-semibold">{comment.user.name}</p>
                    <p className="text-sm">{comment.content}</p>
                </div>
                <div className="mt-1 flex space-x-3 text-xs text-gray-500">
                    {!isReply && (
                        <>
                            <button onClick={() => onReply(replyingTo === comment.id ? null : comment.id)} className="font-semibold hover:underline">
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
                            <img src={userAvatar?.startsWith('http') ? userAvatar : userAvatar ? `/storage/${userAvatar}` : undefined} alt="Your avatar" className="h-6 w-6 rounded-full" />
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

                {comment.replies?.length > 0 && (
                    <div className="mt-2">
                        {comment.replies.map((reply) => (
                            <Comment
                                key={reply.id}
                                comment={reply}
                                isReply={true}
                                onReply={onReply}
                                replyingTo={replyingTo}
                                replyContents={replyContents}
                                setReplyContents={setReplyContents}
                                handleReply={handleReply}
                                sendingReply={sendingReply}
                                userAvatar={userAvatar}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
