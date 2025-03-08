import { Post as PostType } from '@/types';
import Post from '@/components/posts/Post';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Props {
    post: PostType;
}

export default function Show({ post }: Props) {
    return (
        <section>
            <Head title={`Post by ${post.user.name}`} />

            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
                <div className="relative max-w-2xl w-full animate-fadeIn">
                    <a
                        href="/"
                        className="absolute -top-12 left-0 text-white hover:text-gray-200 flex items-center gap-2"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Feed
                    </a>
                    <Post post={post} />
                </div>
            </div>
        </section>
    );
}
