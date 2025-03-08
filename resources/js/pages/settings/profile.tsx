import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type BreadcrumbItem, type PostType, type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useRef } from 'react';

import InputError from '@/components/input-error';
import CreatePostForm from '@/components/posts/CreatePostForm';
import Post from '@/components/posts/Post';
import { Button } from '@/components/ui/button';
import SettingsLayout from '@/layouts/settings/layout';
import ProfileLayout from '@/layouts/settings/profile-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile',
        href: '/settings/profile',
    },
];

interface ProfileForm extends Record<string, any> {
    name: string;
    avatar: File | null;
    cover_photo: File | null;
    _method: string;
}

export default function Profile() {
    const { auth, userPosts } = usePage<SharedData & { userPosts: PostType[] }>().props;
    const fileInput = useRef<HTMLInputElement>(null);
    const coverPhotoInput = useRef<HTMLInputElement>(null);

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<ProfileForm>({
        name: auth.user.name,
        avatar: null,
        cover_photo: null,
        _method: 'patch',
    });

    const updateProfile = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('_method', 'PATCH');
        formData.append('name', data.name);
        if (data.avatar) {
            formData.append('avatar', data.avatar);
        }
        if (data.cover_photo) {
            formData.append('cover_photo', data.cover_photo);
        }

        post(route('profile.update'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                if (data.avatar) {
                    setData('avatar', null);
                }
                if (data.cover_photo) {
                    setData('cover_photo', null);
                }
            },
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setData('avatar', e.target.files[0]);
        }
    };

    const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setData('cover_photo', e.target.files[0]);
        }
    };

    return (
        <ProfileLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile" />

            <SettingsLayout>
                {/* Cover Photo Section - Updated height and styling */}
                <div className="relative h-[250px] w-full overflow-hidden bg-gray-200 sm:h-[350px] md:h-[400px] dark:bg-gray-700">
                    <img
                        src={data.cover_photo ? URL.createObjectURL(data.cover_photo) : auth.user.cover_photo || '/images/default-cover.jpg'}
                        alt="Cover"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute right-2 bottom-2 flex space-x-2 sm:right-4 sm:bottom-4">
                        <Button
                            variant="secondary"
                            className="bg-white/90 text-xs hover:bg-white/80 sm:text-sm dark:bg-gray-800/90 dark:hover:bg-gray-800/80"
                            onClick={() => coverPhotoInput.current?.click()}
                        >
                            <i className="fas fa-camera mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Edit Cover Photo</span>
                            <span className="sm:hidden">Edit</span>
                        </Button>
                    </div>
                    <input type="file" ref={coverPhotoInput} className="hidden" onChange={handleCoverPhotoChange} accept="image/*" />
                </div>

                {/* Profile Header Section - Updated for responsiveness */}
                <div className="relative mx-auto max-w-[1095px] px-2 sm:px-4">
                    <form onSubmit={updateProfile} className="space-y-6">
                        <div className="-mt-[28px] flex flex-col items-center border-b border-gray-200 pb-4 sm:flex-row sm:items-end sm:items-start sm:space-x-5 dark:border-gray-700">
                            <div className="relative z-10 sm:ml-8">
                                <Avatar className="h-[120px] w-[120px] ring-4 ring-white sm:h-[168px] sm:w-[168px] dark:ring-gray-800">
                                    <AvatarImage
                                        src={
                                            data.avatar
                                                ? URL.createObjectURL(data.avatar)
                                                : auth.user.avatar?.startsWith('http')
                                                  ? auth.user.avatar
                                                  : auth.user.avatar
                                                    ? `/storage/${auth.user.avatar}`
                                                    : undefined
                                        }
                                    />
                                    <AvatarFallback>{auth.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <input type="file" ref={fileInput} className="hidden" onChange={handleAvatarChange} accept="image/*" />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="absolute right-1 bottom-1 h-6 w-6 rounded-full bg-gray-200 p-0 hover:bg-gray-300 sm:right-2 sm:bottom-2 sm:h-8 sm:w-8 dark:bg-gray-700"
                                    onClick={() => fileInput.current?.click()}
                                >
                                    <i className="fas fa-camera text-xs sm:text-sm" />
                                </Button>
                                {errors.avatar && <InputError message={errors.avatar} className="mt-2" />}
                            </div>

                            <div className="mt-4 flex-1 text-center sm:mt-0 sm:text-left">
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full border-0 bg-transparent p-0 text-center text-2xl font-bold text-gray-900 focus:ring-0 sm:text-left sm:text-[32px] dark:text-white"
                                    placeholder="Your name"
                                />
                                {errors.name && <InputError message={errors.name} className="mt-1" />}
                                <p className="text-sm text-gray-500 sm:text-[15px] dark:text-gray-400">500 friends</p>
                            </div>

                            <div className="mt-4 flex justify-center space-x-3 sm:mt-0 sm:justify-start">
                                <Button type="submit" variant="default" disabled={processing} className="text-sm sm:text-base">
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </form>

                    {/* Navigation Tabs - Updated for responsiveness */}
                    <div className="overflow-x-auto border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex min-w-max space-x-1">
                            <a
                                href="#"
                                className="border-b-[3px] border-blue-600 px-3 py-3 text-sm font-semibold text-blue-600 sm:px-4 sm:py-4 sm:text-[15px]"
                            >
                                Posts
                            </a>
                            <a
                                href="#"
                                className="px-3 py-3 text-sm font-medium text-gray-500 hover:bg-gray-100 sm:px-4 sm:py-4 sm:text-[15px] dark:hover:bg-gray-800"
                            >
                                About
                            </a>
                            <a
                                href="#"
                                className="px-3 py-3 text-sm font-medium text-gray-500 hover:bg-gray-100 sm:px-4 sm:py-4 sm:text-[15px] dark:hover:bg-gray-800"
                            >
                                Friends
                            </a>
                            <a
                                href="#"
                                className="px-3 py-3 text-sm font-medium text-gray-500 hover:bg-gray-100 sm:px-4 sm:py-4 sm:text-[15px] dark:hover:bg-gray-800"
                            >
                                Photos
                            </a>
                            <a
                                href="#"
                                className="px-3 py-3 text-sm font-medium text-gray-500 hover:bg-gray-100 sm:px-4 sm:py-4 sm:text-[15px] dark:hover:bg-gray-800"
                            >
                                Videos
                            </a>
                        </nav>
                    </div>

                    {/* Main Content Area - Updated grid for responsiveness */}
                    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(250px,360px)_1fr]">
                        {/* Left Sidebar */}
                        <div className="space-y-4">
                            <div className="rounded-lg bg-white p-3 shadow sm:p-4 dark:bg-gray-800">
                                <h2 className="text-[15px] font-semibold sm:text-[17px]">Intro</h2>
                                <div className="mt-2 space-y-2 sm:mt-3 sm:space-y-3">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-center bg-gray-100 text-sm font-medium hover:bg-gray-200 sm:text-base dark:bg-gray-700 dark:hover:bg-gray-600"
                                    >
                                        Add Bio
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-center bg-gray-100 text-sm font-medium hover:bg-gray-200 sm:text-base dark:bg-gray-700 dark:hover:bg-gray-600"
                                    >
                                        Add Hobbies
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-center bg-gray-100 text-sm font-medium hover:bg-gray-200 sm:text-base dark:bg-gray-700 dark:hover:bg-gray-600"
                                    >
                                        Add Featured
                                    </Button>
                                </div>
                            </div>

                            {/* Photos Section */}
                            <div className="rounded-lg bg-white p-3 shadow sm:p-4 dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-[15px] font-semibold sm:text-[17px]">Photos</h2>
                                    <a
                                        href="#"
                                        className="rounded px-2 py-1 text-sm font-medium text-blue-600 hover:bg-gray-100 sm:text-[15px] dark:hover:bg-gray-700"
                                    >
                                        See All
                                    </a>
                                </div>
                                <div className="mt-2 grid grid-cols-3 gap-1 sm:mt-3 sm:gap-2">{/* Add photo grid here */}</div>
                            </div>
                        </div>

                        {/* Main Content - Posts */}
                        <div className="space-y-4">
                            <CreatePostForm />

                            {/* Posts List */}
                            <div className="space-y-4">
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
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </ProfileLayout>
    );
}
