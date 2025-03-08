import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
import { ProfileForm } from '@/types/profile';
import { useRef } from 'react';

interface Props {
    data: ProfileForm;
    auth: SharedData['auth'];
    hasChanges: boolean;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileHeader({ data, auth, hasChanges, processing, onSubmit, onNameChange, onAvatarChange }: Props) {
    const fileInput = useRef<HTMLInputElement>(null);

    return (
        <form
            onSubmit={onSubmit}
            className="relative flex flex-col border-b border-gray-200 pb-4 lg:flex-row lg:items-end lg:pb-0 dark:border-gray-700"
        >
            <div className="relative -mt-[85px] ml-4 lg:-mt-[132px]">
                <Avatar className="h-[168px] w-[168px] rounded-full border-4 border-white ring-0 dark:border-gray-900">
                    <AvatarImage
                        src={data.avatar ? URL.createObjectURL(data.avatar) : auth.user.avatar ? `/storage/${auth.user.avatar}` : undefined}
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
                <input type="file" ref={fileInput} className="hidden" onChange={onAvatarChange} accept="image/*" />
            </div>

            <div className="flex flex-1 flex-col px-4 pt-4 lg:pt-0">
                <input
                    type="text"
                    value={data.name}
                    onChange={onNameChange}
                    className="w-full border-0 bg-transparent p-0 text-3xl font-bold text-gray-900 focus:ring-0 dark:text-white"
                    placeholder="Your name"
                />
            </div>

            {hasChanges && (
                <Button type="submit" className="flex items-center gap-2 bg-green-600 px-4 font-semibold hover:bg-green-700" disabled={processing}>
                    {processing ? (
                        <>
                            <i className="fas fa-spinner fa-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-save" />
                            Save Changes
                        </>
                    )}
                </Button>
            )}
        </form>
    );
}
