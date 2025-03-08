import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type BreadcrumbItem, type PostType, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useRef } from 'react';

import CreatePostForm from '@/components/posts/CreatePostForm';
import InputError from '@/components/input-error';
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
                {/* Cover Photo Section */}
                <div className="relative h-[350px] w-full overflow-hidden rounded-b-xl bg-gray-200 dark:bg-gray-700">
                    <img
                        src={data.cover_photo ? URL.createObjectURL(data.cover_photo) : auth.user.cover_photo || '/images/default-cover.jpg'}
                        alt="Cover"
                        className="h-full w-full object-cover"
                    />
                    <input type="file" ref={coverPhotoInput} className="hidden" onChange={handleCoverPhotoChange} accept="image/*" />
                    <Button
                        variant="secondary"
                        className="absolute right-4 bottom-4 bg-white/90 dark:bg-gray-800/90"
                        onClick={() => coverPhotoInput.current?.click()}
                    >
                        <i className="fas fa-camera mr-2" />
                        Edit Cover Photo
                    </Button>
                </div>

                {/* Profile Header Section */}
                <div className="relative mx-auto max-w-5xl px-4">
                    <form onSubmit={updateProfile} className="space-y-6">
                        <div className="-mt-[96px] flex flex-col items-center sm:flex-row sm:items-end sm:space-x-5">
                            <div className="relative">
                                <Avatar className="h-[168px] w-[168px] ring-4 ring-white dark:ring-gray-800">
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
                                    className="absolute right-4 bottom-4 h-8 w-8 rounded-full bg-gray-200 p-0 hover:bg-gray-300 dark:bg-gray-700"
                                    onClick={() => fileInput.current?.click()}
                                >
                                    <i className="fas fa-camera" />
                                </Button>
                                {errors.avatar && <InputError message={errors.avatar} className="mt-2" />}
                            </div>

                            <div className="mt-6 flex-1 sm:mt-0">
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full border-0 bg-transparent p-0 text-3xl font-bold text-gray-900 focus:ring-0 dark:text-white"
                                    placeholder="Your name"
                                />
                                {errors.name && <InputError message={errors.name} className="mt-1" />}
                                <p className="text-gray-500 dark:text-gray-400">500 friends</p>
                            </div>

                            <div className="mt-6 flex space-x-3 sm:mt-0">
                                <Button type="submit" variant="default" disabled={processing}>
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </form>

                    {/* Show success message */}
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="mt-2 text-sm text-green-600 dark:text-green-400">Profile updated successfully.</p>
                    </Transition>

                    {/* Navigation Tabs */}
                    <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-8">
                            <a href="#" className="border-b-2 border-blue-500 px-1 py-4 text-sm font-medium whitespace-nowrap text-blue-600">
                                Posts
                            </a>
                            <a href="#" className="px-1 py-4 text-sm font-medium whitespace-nowrap text-gray-500 hover:text-gray-700">
                                About
                            </a>
                            <a href="#" className="px-1 py-4 text-sm font-medium whitespace-nowrap text-gray-500 hover:text-gray-700">
                                Friends
                            </a>
                            <a href="#" className="px-1 py-4 text-sm font-medium whitespace-nowrap text-gray-500 hover:text-gray-700">
                                Photos
                            </a>
                            <a href="#" className="px-1 py-4 text-sm font-medium whitespace-nowrap text-gray-500 hover:text-gray-700">
                                Videos
                            </a>
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left Sidebar */}
                        <div className="space-y-6">
                            <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
                                <h2 className="text-xl font-semibold">Intro</h2>
                                <div className="mt-4 space-y-4">
                                    <Button variant="outline" className="w-full">
                                        Add Bio
                                    </Button>
                                    <Button variant="outline" className="w-full">
                                        Add Hobbies
                                    </Button>
                                    <Button variant="outline" className="w-full">
                                        Add Featured
                                    </Button>
                                </div>
                            </div>

                            {/* Photos Section */}
                            <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">Photos</h2>
                                    <a href="#" className="text-sm text-blue-600">
                                        See All Photos
                                    </a>
                                </div>
                                <div className="mt-4 grid grid-cols-3 gap-2">{/* Add photo grid here */}</div>
                            </div>
                        </div>

                        {/* Main Content - Posts */}
                        <div className="space-y-6 lg:col-span-2">
                            <CreatePostForm />

                            {/* Posts List */}
                            <div className="space-y-6">
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
