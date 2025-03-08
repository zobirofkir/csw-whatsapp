import CreatePostForm from '@/components/posts/CreatePostForm';
import Post from '@/components/posts/Post';
import { PostType } from '@/types';

interface Props {
    userPosts: PostType[];
}

export default function PostsList({ userPosts }: Props) {
    return (
        <div className="space-y-4">
            <CreatePostForm />
            {userPosts.length > 0 ? (
                userPosts.map((post) => (
                    <Post
                        key={post.id}
                        post={{
                            ...post,
                            user: {
                                ...post.user,
                                timestamp: post.created_at || 'Just now',
                            },
                            hasReacted: !!post.user_reaction,
                            userReaction: post.user_reaction,
                            reactionCounts: post.reaction_counts || {},
                            comments: post.comments.map((comment) => ({
                                ...comment,
                                reactions: comment.reactions || [],
                                replies: comment.replies || [],
                                timestamp: comment.created_at || 'Just now',
                            })),
                        }}
                    />
                ))
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">No posts yet</p>
            )}
        </div>
    );
}
