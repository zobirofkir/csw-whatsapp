import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

interface ProfileForm {
    name: string;
    email: string;
}

export default function Profile() {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="mx-auto max-w-[1012px]">
                    <div className="rounded-lg bg-white shadow-sm dark:bg-[#242526]">
                        {/* Header Section */}
                        <div className="border-b border-[#E4E6EB] px-4 py-5 dark:border-[#3E4042]">
                            <h1 className="text-[20px] font-semibold text-[#050505] dark:text-[#E4E6EB]">General Account Settings</h1>
                        </div>

                        {/* Main Content */}
                        <form onSubmit={submit}>
                            <div className="divide-y divide-[#E4E6EB] dark:divide-[#3E4042]">
                                {/* Name Field */}
                                <div className="px-4 py-4 transition duration-200 hover:bg-[#F2F2F2] dark:hover:bg-[#3A3B3C]">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <Label htmlFor="name" className="block text-[15px] font-medium text-[#050505] dark:text-[#E4E6EB]">
                                                Name
                                            </Label>
                                            <div className="flex items-center gap-4">
                                                <Input
                                                    id="name"
                                                    className="mt-1.5 h-9 w-full max-w-[320px] border-[#CED0D4] bg-[#F0F2F5] text-[15px] focus:border-[#1B74E4] focus:ring-[#1B74E4] dark:border-[#3E4042] dark:bg-[#3A3B3C] dark:focus:border-[#1B74E4] dark:focus:ring-[#1B74E4]"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    required
                                                    autoComplete="name"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="link"
                                                    className="text-[15px] font-semibold text-[#1B74E4] hover:underline dark:text-[#4599FF]"
                                                >
                                                    Edit
                                                </Button>
                                            </div>
                                            <InputError message={errors.name} className="mt-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="px-4 py-4 transition duration-200 hover:bg-[#F2F2F2] dark:hover:bg-[#3A3B3C]">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <Label htmlFor="email" className="block text-[15px] font-medium text-[#050505] dark:text-[#E4E6EB]">
                                                Email
                                            </Label>
                                            <div className="flex items-center gap-4">
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    className="mt-1.5 h-9 w-full max-w-[320px] cursor-not-allowed border-[#CED0D4] bg-[#F0F2F5] text-[15px] dark:border-[#3E4042] dark:bg-[#3A3B3C]"
                                                    value={data.email}
                                                    required
                                                    autoComplete="username"
                                                    disabled
                                                />
                                                <Button
                                                    type="button"
                                                    variant="link"
                                                    className="text-[15px] font-semibold text-[#1B74E4] hover:underline dark:text-[#4599FF]"
                                                >
                                                    Edit
                                                </Button>
                                            </div>
                                            <InputError message={errors.email} className="mt-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* Save Button Section */}
                                <div className="bg-[#F0F2F5] px-4 py-4 dark:bg-[#18191A]">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            disabled={processing}
                                            className="h-9 rounded-md bg-[#1B74E4] px-8 text-[15px] font-semibold hover:bg-[#1877F2] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Save changes
                                        </Button>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out duration-300"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out duration-300"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-[13px] font-medium text-[#00A400]">Changes saved successfully</p>
                                        </Transition>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Delete Account Section */}
                    <div className="mt-8 border-t border-[#CED0D4] pt-8 dark:border-[#3E4042]">
                        <DeleteUser />
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
