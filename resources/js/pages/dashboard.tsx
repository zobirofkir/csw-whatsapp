import CreatePostForm from '@/components/posts/CreatePostForm';
import Post from '@/components/posts/Post';
import { SAMPLE_POSTS } from '@/data/sample-posts';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AppLayout>
            <Head title="News Feed" />

            <div className="space-y-4 py-4">
                <CreatePostForm />

                {SAMPLE_POSTS.map((post) => (
                    <Post key={post.id} post={post} />
                ))}
            </div>
        </AppLayout>
    );
}
