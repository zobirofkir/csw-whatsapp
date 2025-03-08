import CreatePostForm from '@/components/posts/CreatePostForm';
import PostList from '@/components/posts/PostList';
import StoriesContainer from '@/components/stories/StoriesContainer';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';

export default function Account() {
    const { auth } = usePage<SharedData>().props;
    return (
        <AppLayout>
            <Head title={auth?.user?.name} />

            <div className="space-y-6">
                <StoriesContainer />
                <CreatePostForm />
                <PostList />
            </div>
        </AppLayout>
    );
}
