import { type BreadcrumbItem, type FormDataType, type PageProps, type PostType, type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

import CoverPhotoSection from '@/components/profile/CoverPhotoSection';
import ProfileIntroSection from '@/components/profile/ProfileIntroSection';
import PostsList from '@/components/profile/PostsList';
import SettingsLayout from '@/layouts/settings/layout';
import ProfileLayout from '@/layouts/settings/profile-layout';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileTabs from '@/components/profile/ProfileTabs';

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

interface IntroForm {
    bio: string;
    work?: string;
    education?: string;
    location?: string;
    relationship?: string;
}

export default function Profile() {
    const { auth, userPosts } = usePage<CustomPageProps>().props;
    const fileInput = useRef<HTMLInputElement>(null);
    const coverPhotoInput = useRef<HTMLInputElement>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [activeIntroForm, setActiveIntroForm] = useState<'bio' | 'details' | 'featured' | null>(null);
    const [introForm, setIntroForm] = useState<IntroForm>({
        bio: auth.user.bio || '',
        work: auth.user.work || '',
        education: auth.user.education || '',
        location: auth.user.location || '',
        relationship: auth.user.relationship || '',
    });

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<ProfileForm>({
        name: auth.user.name,
        avatar: null,
        cover_photo: null,
        _method: 'patch',
    });

    useEffect(() => {
        const hasNameChange = data.name !== auth.user.name;
        const hasAvatarChange = data.avatar !== null;
        const hasCoverPhotoChange = data.cover_photo !== null;

        setHasChanges(hasNameChange || hasAvatarChange || hasCoverPhotoChange);
    }, [data, auth.user.name]);

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

    const handleIntroSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would implement the API call to save the intro data
        post(route('profile.update.intro'), {
            preserveScroll: true,
            data: introForm,
            onSuccess: () => {
                setActiveIntroForm(null);
            },
        });
    };

    return (
        <ProfileLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile" />

            <SettingsLayout>
                <CoverPhotoSection coverPhoto={data.cover_photo} userCoverPhoto={auth.user.cover_photo} onCoverPhotoChange={handleCoverPhotoChange} />

                <div className="relative mx-auto max-w-[1095px] px-4">
                    <ProfileHeader
                        data={data}
                        auth={auth}
                        hasChanges={hasChanges}
                        processing={processing}
                        onSubmit={updateProfile}
                        onNameChange={(e) => setData('name', e.target.value)}
                        onAvatarChange={handleAvatarChange}
                    />

                    <ProfileTabs />

                    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
                        <div className="space-y-4">
                            <ProfileIntroSection
                                introForm={introForm}
                                activeIntroForm={activeIntroForm}
                                setIntroForm={setIntroForm}
                                setActiveIntroForm={setActiveIntroForm}
                                onSubmit={handleIntroSubmit}
                            />
                            {/* Photos section component can go here */}
                        </div>

                        <PostsList userPosts={userPosts} />
                    </div>
                </div>
            </SettingsLayout>
        </ProfileLayout>
    );
}
