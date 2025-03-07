import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
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
                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm">
                        {/* Header Section */}
                        <div className="px-4 py-5 border-b border-neutral-200 dark:border-neutral-800">
                            <h1 className="text-[20px] font-bold text-neutral-900 dark:text-white">
                                Profile settings
                            </h1>
                            <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mt-1">
                                Update your personal information and manage your account
                            </p>
                        </div>

                        {/* Main Content */}
                        <form onSubmit={submit} className="p-4">
                            <div className="space-y-6">
                                {/* Name Field */}
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                    <Label
                                        htmlFor="name"
                                        className="w-full md:w-[200px] text-[15px] font-medium text-neutral-700 dark:text-neutral-200"
                                    >
                                        Name
                                    </Label>
                                    <div className="flex-1">
                                        <Input
                                            id="name"
                                            className="w-full max-w-[320px] h-9 text-[15px]"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            autoComplete="name"
                                            placeholder="Full name"
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                    <Label
                                        htmlFor="email"
                                        className="w-full md:w-[200px] text-[15px] font-medium text-neutral-700 dark:text-neutral-200"
                                    >
                                        Email address
                                    </Label>
                                    <div className="flex-1">
                                        <Input
                                            id="email"
                                            type="email"
                                            className="w-full max-w-[320px] h-9 text-[15px] bg-neutral-50 dark:bg-neutral-800"
                                            value={data.email}
                                            required
                                            autoComplete="username"
                                            disabled
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                </div>

                                {/* Save Button Section */}
                                <div className="flex items-center gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                                    <Button
                                        disabled={processing}
                                        className="h-9 px-8 bg-blue-500 hover:bg-blue-600 text-[15px]"
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
                                        <p className="text-[13px] text-emerald-600 dark:text-emerald-400">
                                            Changes saved successfully
                                        </p>
                                    </Transition>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Delete Account Section */}
                    <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
                        <DeleteUser />
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
