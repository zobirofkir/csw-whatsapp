import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
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

export default function Profile({ status }: { status?: string }) {
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
                <div className="max-w-[1012px] mx-auto">
                    <div className="bg-white dark:bg-[#242526] rounded-lg">
                        {/* Header Section */}
                        <div className="px-4 py-5 border-b border-[#3E4042] dark:border-[#3E4042]">
                            <h1 className="text-[24px] font-bold text-[#050505] dark:text-[#E4E6EB]">
                                General Account Settings
                            </h1>
                        </div>

                        {/* Main Content */}
                        <form onSubmit={submit}>
                            <div className="divide-y divide-[#3E4042] dark:divide-[#3E4042]">
                                {/* Name Field */}
                                <div className="px-4 py-3 hover:bg-[#F2F2F2] dark:hover:bg-[#3A3B3C] transition">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <Label
                                                htmlFor="name"
                                                className="block text-[15px] font-medium text-[#65676B] dark:text-[#B0B3B8]"
                                            >
                                                Name
                                            </Label>
                                            <div className="flex items-center gap-4">
                                                <Input
                                                    id="name"
                                                    className="mt-1 w-full max-w-[320px] h-9 text-[15px] bg-white dark:bg-[#242526] border-[#CED0D4] dark:border-[#3E4042]"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    required
                                                    autoComplete="name"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="link"
                                                    className="text-[#216FDB] dark:text-[#4599FF] hover:underline text-[15px] font-semibold"
                                                >
                                                    Edit
                                                </Button>
                                            </div>
                                            <InputError message={errors.name} />
                                        </div>
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="px-4 py-3 hover:bg-[#F2F2F2] dark:hover:bg-[#3A3B3C] transition">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <Label
                                                htmlFor="email"
                                                className="block text-[15px] font-medium text-[#65676B] dark:text-[#B0B3B8]"
                                            >
                                                Email
                                            </Label>
                                            <div className="flex items-center gap-4">
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    className="mt-1 w-full max-w-[320px] h-9 text-[15px] bg-[#F0F2F5] dark:bg-[#3A3B3C] border-[#CED0D4] dark:border-[#3E4042]"
                                                    value={data.email}
                                                    required
                                                    autoComplete="username"
                                                    disabled
                                                />
                                                <Button
                                                    type="button"
                                                    variant="link"
                                                    className="text-[#216FDB] dark:text-[#4599FF] hover:underline text-[15px] font-semibold"
                                                >
                                                    Edit
                                                </Button>
                                            </div>
                                            <InputError message={errors.email} />
                                        </div>
                                    </div>
                                </div>

                                {/* Save Button Section */}
                                <div className="px-4 py-3">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            disabled={processing}
                                            className="h-9 px-8 bg-[#216FDB] hover:bg-[#1877F2] text-[15px] font-semibold"
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
                                            <p className="text-[13px] text-[#00A400]">
                                                Changes saved successfully
                                            </p>
                                        </Transition>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Delete Account Section */}
                    <div className="mt-8 pt-8 border-t border-[#3E4042] dark:border-[#3E4042]">
                        <DeleteUser />
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
