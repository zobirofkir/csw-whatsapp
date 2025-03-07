import axios from 'axios';
import { useEffect, useState } from 'react';
import Post from './Post';

interface PostData {
    id: number;
    user: {
        name: string;
        avatar: string;
        timestamp: string;
    };
    content: string;
    media: {
        id: number;
        url: string;
        type: 'image' | 'video';
    }[];
    likes: number;
    comments: number;
}

export default function PostList() {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/posts');
                setPosts(response.data.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching posts:', err);
                setError('Failed to load posts. Please try again later.');
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div className="p-4 text-center">Loading posts...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-4">
            {posts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No posts yet.</div>
            ) : (
                posts.map((post) => <Post key={post.id} post={post} />)
            )}
        </div>
    );
}
