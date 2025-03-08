import { Button } from '@/components/ui/button';
import { useRef } from 'react';

interface Props {
    coverPhoto: File | null;
    userCoverPhoto: string | undefined;
    onCoverPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CoverPhotoSection({ coverPhoto, userCoverPhoto, onCoverPhotoChange }: Props) {
    const coverPhotoInput = useRef<HTMLInputElement>(null);

    return (
        <div className="relative h-[200px] w-full overflow-hidden bg-gray-200 sm:h-[300px] lg:h-[350px] dark:bg-gray-700">
            <img
                src={
                    coverPhoto
                        ? URL.createObjectURL(coverPhoto)
                        : userCoverPhoto
                          ? `/storage/${userCoverPhoto}`
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
            <input type="file" ref={coverPhotoInput} className="hidden" onChange={onCoverPhotoChange} accept="image/*" />
        </div>
    );
}
