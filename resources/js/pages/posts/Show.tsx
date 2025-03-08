import Post from '@/components/posts/Post';
import { Post as PostType } from '@/types';
import { Head, usePage } from '@inertiajs/react';

interface Props {
    post: PostType;
}

export default function Show({ post }: Props) {
    const {auth} = usePage().props;
    return (
        <section>
            <Head title={`Post by ${post.user.name}`} />

            <div className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-[#F0F2F5] dark:bg-[#1C1E21]">
                {/* Modal Container */}
                <div className="animate-fadeIn relative my-0 min-h-screen w-full max-w-[680px] bg-white shadow-xl md:my-8 md:min-h-0 md:rounded-lg dark:bg-[#242526]">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-[#050505] dark:text-white">{post.user.name} Post</h2>
                        <a
                            href={auth?.user ? `/account/auth/${auth.user.name}` : '/'}
                            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                            <svg className="h-6 w-6 text-gray-500 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.984 6.422L13.406 12l5.578 5.578-1.406 1.406L12 13.406l-5.578 5.578-1.406-1.406L10.594 12 5.016 6.422l1.406-1.406L12 10.594l5.578-5.578z" />
                            </svg>
                        </a>
                    </div>

                    {/* Post Content */}
                    <div className="p-4">
                        <Post post={post} />
                    </div>
                </div>
            </div>
        </section>
    );
}
