import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SettingsLayout from '@/layouts/settings/layout';
import ProfileLayout from '@/layouts/settings/profile-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

interface ProfileForm extends Record<string, any> {
    name: string;
    avatar: File | null;
    _method: string;
}

export default function Profile() {
    const { auth } = usePage<SharedData>().props;
    const fileInput = useRef<HTMLInputElement>(null);

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<ProfileForm>({
        name: auth.user.name,
        avatar: null,
        _method: 'patch',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('_method', 'PATCH');
        formData.append('name', data.name);
        if (data.avatar) {
            formData.append('avatar', data.avatar);
        }

        post(route('profile.update'), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setData('avatar', e.target.files[0]);
        }
    };

    return (
        <ProfileLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="mx-auto max-w-3xl">
                    <div className="space-y-6">
                        {/* Profile Information Card */}
                        <div className="rounded-xl bg-white shadow-sm dark:bg-gray-800">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Profile Information</h2>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Update your account's profile information and email address.
                                </p>

                                <form onSubmit={submit} className="mt-6 space-y-6">
                                    {/* Avatar Section */}
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-20 w-20">
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
                                        <div className="flex-1">
                                            <input type="file" ref={fileInput} className="hidden" onChange={handleFileChange} accept="image/*" />
                                            <Button type="button" variant="outline" onClick={() => fileInput.current?.click()}>
                                                Change Avatar
                                            </Button>
                                            {errors.avatar && <InputError message={errors.avatar} className="mt-2" />}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            autoComplete="name"
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button
                                            disabled={processing}
                                            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out hover:bg-blue-700 focus:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:bg-blue-900 disabled:opacity-50"
                                        >
                                            Save Changes
                                        </Button>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out duration-300"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out duration-300"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-green-600 dark:text-green-400">Saved successfully.</p>
                                        </Transition>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Delete Account Card */}
                        <div className="rounded-xl bg-white shadow-sm dark:bg-gray-800">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Delete Account</h2>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Once your account is deleted, all of its resources and data will be permanently deleted.
                                </p>
                                <div className="mt-6">
                                    <DeleteUser />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </ProfileLayout>
    );
}
