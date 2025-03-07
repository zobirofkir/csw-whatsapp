import CreatePostForm from '@/components/posts/CreatePostForm';
import Post from '@/components/posts/Post';
import StoriesContainer from '@/components/stories/StoriesContainer';
import { SAMPLE_POSTS } from '@/data/sample-posts';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';

export default function Account() {
    const { auth } = usePage<SharedData>().props;
    return (
        <AppLayout>
            <Head title={auth?.user?.name} />

            <div className="space-y-4 py-4">
                <StoriesContainer />
                <CreatePostForm />

                {SAMPLE_POSTS.map((post) => (
                    <Post key={post.id} post={post} />
                ))}
            </div>
        </AppLayout>
    );
}
