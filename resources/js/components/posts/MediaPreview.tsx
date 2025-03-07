import { MediaItem } from '@/types/post';

interface MediaPreviewProps {
    mediaItems: MediaItem[];
    onRemove: (index: number) => void;
}

export function MediaPreview({ mediaItems, onRemove }: MediaPreviewProps) {
    return (
        <div className="mt-4 mb-3 grid grid-cols-2 gap-2">
            {mediaItems.map((item, index) => (
                <div key={index} className="relative">
                    {item.type === 'image' ? (
                        <img src={item.preview} alt="Selected" className="w-full rounded-lg object-cover" />
                    ) : (
                        <video src={item.preview} className="w-full rounded-lg" controls />
                    )}
                    <button
                        onClick={() => onRemove(index)}
                        className="absolute top-2 right-2 rounded-full bg-gray-900/70 p-1.5 text-white hover:bg-gray-900/90"
                        title="Remove media"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    );
}
