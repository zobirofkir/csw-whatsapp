import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type BreadcrumbItem, type FormDataType, type PageProps, type PostType, type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useRef } from 'react';

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

interface ProfileForm extends FormDataType {
    name: string;
    avatar: File | null;
    cover_photo: File | null;
    _method: string;
}

interface CustomPageProps extends PageProps {
    auth: SharedData['auth'];
    userPosts: PostType[];
}

export default function Profile() {
    const { auth, userPosts } = usePage<CustomPageProps>().props;
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
                {/* Cover Photo Section - Updated to match Facebook dimensions */}
                <div className="relative h-[200px] w-full overflow-hidden bg-gray-200 sm:h-[300px] lg:h-[350px] dark:bg-gray-700">
                    <img
                        src={
                            data.cover_photo
                                ? URL.createObjectURL(data.cover_photo)
                                : auth.user.cover_photo
                                  ? `/storage/${auth.user.cover_photo}`
                                  : '/images/default-cover.jpg'
                        }
                        alt="Cover"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute right-4 bottom-4 flex space-x-2">
                        <Button
                            variant="secondary"
                            className="flex items-center gap-2 bg-white/95 px-4 py-2 text-sm font-semibold text-black hover:bg-white/90 dark:bg-black/75 dark:text-white dark:hover:bg-black/60"
                            onClick={() => coverPhotoInput.current?.click()}
                        >
                            <i className="fas fa-camera" />
                            Edit cover photo
                        </Button>
                    </div>
                    <input type="file" ref={coverPhotoInput} className="hidden" onChange={handleCoverPhotoChange} accept="image/*" />
                </div>

                {/* Profile Header Section - Updated to Facebook style */}
                <div className="relative mx-auto max-w-[1095px] px-4">
                    <form onSubmit={updateProfile} className="space-y-6">
                        <div className="relative flex flex-col border-b border-gray-200 pb-4 lg:flex-row lg:items-end lg:pb-0 dark:border-gray-700">
                            {/* Profile Picture */}
                            <div className="relative -mt-[85px] ml-4 lg:-mt-[132px]">
                                <Avatar className="h-[168px] w-[168px] rounded-full border-4 border-white ring-0 dark:border-gray-900">
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
                                        className="rounded-full object-cover"
                                    />
                                    <AvatarFallback>{auth.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="absolute right-2 bottom-2 h-10 w-10 rounded-full bg-gray-200 p-0 hover:bg-gray-300 dark:bg-gray-700"
                                    onClick={() => fileInput.current?.click()}
                                >
                                    <i className="fas fa-camera" />
                                </Button>
                                <input type="file" ref={fileInput} className="hidden" onChange={handleAvatarChange} accept="image/*" />
                            </div>

                            {/* Name and Friends Count */}
                            <div className="flex flex-1 flex-col px-4 pt-4 lg:pt-0">
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full border-0 bg-transparent p-0 text-3xl font-bold text-gray-900 focus:ring-0 dark:text-white"
                                    placeholder="Your name"
                                />
                                <p className="text-[15px] text-gray-500 dark:text-gray-400">500 friends</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-4 flex items-center space-x-2 px-4 lg:mt-0">
                                <Button type="submit" className="flex items-center gap-2 bg-blue-600 px-4 font-semibold hover:bg-blue-700">
                                    <i className="fas fa-plus" />
                                    Add to story
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="flex items-center gap-2 bg-gray-200 px-4 font-semibold text-black hover:bg-gray-300 dark:bg-gray-700 dark:text-white"
                                >
                                    <i className="fas fa-pen" />
                                    Edit profile
                                </Button>
                            </div>
                        </div>
                    </form>

                    {/* Navigation Tabs - Updated to Facebook style */}
                    <div className="mt-1 border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-1">
                            <a
                                href="#"
                                className="border-b-[3px] border-blue-600 px-4 py-4 text-[15px] font-semibold text-blue-600"
                                aria-current="page"
                            >
                                Posts
                            </a>
                            <a
                                href="#"
                                className="px-4 py-4 text-[15px] font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                About
                            </a>
                            <a
                                href="#"
                                className="px-4 py-4 text-[15px] font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Friends
                            </a>
                            <a
                                href="#"
                                className="px-4 py-4 text-[15px] font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Photos
                            </a>
                            <a
                                href="#"
                                className="px-4 py-4 text-[15px] font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Videos
                            </a>
                        </nav>
                    </div>

                    {/* Main Content Area - Updated grid layout */}
                    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
                        {/* Left Sidebar */}
                        <div className="space-y-4">
                            <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                                <h2 className="text-[17px] font-semibold">Intro</h2>
                                <div className="mt-3 space-y-3">
                                    <Button
                                        variant="secondary"
                                        className="w-full justify-center bg-gray-100 font-medium hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                                    >
                                        Add bio
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        className="w-full justify-center bg-gray-100 font-medium hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                                    >
                                        Edit details
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        className="w-full justify-center bg-gray-100 font-medium hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                                    >
                                        Add featured
                                    </Button>
                                </div>
                            </div>

                            {/* Photos Section */}
                            <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-[17px] font-semibold">Photos</h2>
                                    <a href="#" className="text-[15px] font-medium text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                                        See all photos
                                    </a>
                                </div>
                                <div className="mt-3 grid grid-cols-3 gap-2">{/* Photo grid will go here */}</div>
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
