import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { useRef, useState } from 'react';

// Simple emoji list for basic implementation
const commonEmojis = ['😀', '😊', '👍', '❤️', '😂', '🎉', '🔥', '👋', '😎', '🤔'];

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/avi'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface MediaItem {
    file: File;
    preview: string;
    type: 'image' | 'video';
}

export default function CreatePostForm() {
    const [postContent, setPostContent] = useState('');
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [feeling, setFeeling] = useState('');
    const [activity, setActivity] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showEmojis, setShowEmojis] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setUploadError(null);

        const newMediaItems: MediaItem[] = [];

        files.forEach(file => {
            // Check file size
            if (file.size > MAX_FILE_SIZE) {
                setUploadError('Each file size should not exceed 5MB');
                return;
            }

            let type: 'image' | 'video';
            if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
                type = 'image';
            } else if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
                type = 'video';
            } else {
                setUploadError('Please upload only images (JPG, PNG, GIF) or videos (MP4, MOV, AVI)');
                return;
            }

            newMediaItems.push({
                file,
                preview: URL.createObjectURL(file),
                type,
            });
        });

        setMediaItems(prev => [...prev, ...newMediaItems]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeMedia = (index: number) => {
        setMediaItems(prev => {
            const newItems = [...prev];
            URL.revokeObjectURL(newItems[index].preview);
            newItems.splice(index, 1);
            return newItems;
        });
    };

    const clearMedia = () => {
        mediaItems.forEach(item => {
            URL.revokeObjectURL(item.preview);
        });
        setMediaItems([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setUploadError(null);
    };

    const handleSubmit = async () => {
        if (!postContent.trim()) return;

        setIsLoading(true);
        setUploadError(null);

        const formData = new FormData();
        formData.append('content', postContent);
        mediaItems.forEach((item, index) => {
            formData.append(`media[${index}][file]`, item.file);
            formData.append(`media[${index}][type]`, item.type);
        });
        if (feeling) formData.append('feeling', feeling);
        if (activity) formData.append('activity', activity);

        try {
            await axios.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Reset form
            setPostContent('');
            clearMedia();
            setFeeling('');
            setActivity('');
            setIsEditing(false);
        } catch (error) {
            console.error('Error creating post:', error);
            setUploadError('Failed to create post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const addEmoji = (emoji: string) => {
        setPostContent((prevContent) => prevContent + emoji);
    };

    const startEditing = () => {
        setIsEditing(true);
    };

    const { auth } = usePage().props as any;

    return (
        <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            {/* Profile Section */}
            {!isEditing ? (
                <div className="mb-3 flex items-center space-x-2">
                    <img
                        src={auth?.user?.avatar?.startsWith('http')
                            ? auth.user.avatar
                            : auth.user.avatar
                                ? `/storage/${auth.user.avatar}`
                                : undefined}
                        alt={auth?.user?.name}
                        className="h-10 w-10 rounded-full border border-gray-200"
                    />
                    <button
                        onClick={startEditing}
                        className="flex-grow rounded-full bg-gray-100 px-4 py-2.5 text-left text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                        What's on your mind?
                    </button>
                </div>
            ) : (
                <div className="mb-3">
                    <div className="mb-3 flex items-center space-x-2">
                        <img
                            src={auth?.user?.avatar?.startsWith('http')
                                ? auth.user.avatar
                                : auth.user.avatar
                                    ? `/storage/${auth.user.avatar}`
                                    : undefined}
                            alt={auth?.user?.name} className="h-10 w-10 rounded-full border border-gray-200" />
                        <div className="font-medium">{auth.user.name}</div>
                    </div>
                    <textarea
                        className="w-full resize-none rounded-lg border-0 bg-transparent p-3 text-black focus:ring-0 dark:text-white"
                        placeholder="What's on your mind?"
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        rows={3}
                        autoFocus
                    />
                </div>
            )}

            {/* Media Preview */}
            {mediaItems.length > 0 && (
                <div className="mt-4 mb-3 grid grid-cols-2 gap-2">
                    {mediaItems.map((item, index) => (
                        <div key={index} className="relative">
                            {item.type === 'image' ? (
                                <img src={item.preview} alt="Selected" className="w-full rounded-lg object-cover" />
                            ) : (
                                <video src={item.preview} className="w-full rounded-lg" controls />
                            )}
                            <button
                                onClick={() => removeMedia(index)}
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
            )}

            {/* Error message */}
            {uploadError && <div className="mt-2 text-sm text-red-500">{uploadError}</div>}

            {/* Divider */}
            <div className="my-3 border-b border-gray-300 dark:border-gray-700"></div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
                <div className="grid w-full grid-cols-2 md:flex md:space-x-1">
                    <label className="flex-1 cursor-pointer">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleMediaChange}
                            accept={[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(',')}
                            className="hidden"
                            multiple
                        />
                        <PostActionButton icon="photo" text="Photo/Video" onClick={triggerFileInput} />
                    </label>
                    <PostActionButton icon="emoji" text="Feeling/Activity" onClick={() => setShowEmojis(!showEmojis)} />
                </div>
            </div>

            {/* Post Button - Only show when editing */}
            {isEditing && (
                <div className="mt-3">
                    <button
                        className={`w-full rounded-lg px-4 py-2 font-semibold text-white transition-colors ${
                            isLoading || !postContent.trim() ? 'cursor-not-allowed bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                        onClick={handleSubmit}
                        disabled={isLoading || !postContent.trim()}
                    >
                        {isLoading ? 'Posting...' : 'Post'}
                    </button>
                </div>
            )}

            {/* Emoji Picker */}
            {showEmojis && (
                <div className="absolute z-10 mt-2 rounded-lg border bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <div className="grid grid-cols-5 gap-2">
                        {commonEmojis.map((emoji) => (
                            <button
                                key={emoji}
                                onClick={() => addEmoji(emoji)}
                                className="rounded p-1 text-2xl hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function PostActionButton({ icon, text, onClick }: { icon: 'photo' | 'emoji'; text: string; onClick?: () => void }) {
    const icons = {
        photo: (
            <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </svg>
        ),
        emoji: (
            <svg className="h-6 w-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
        ),
    };

    return (
        <button
            className="flex flex-1 items-center justify-center space-x-2 rounded-lg py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onClick}
        >
            {icons[icon]}
            <span className="font-medium text-gray-600 dark:text-gray-300">{text}</span>
        </button>
    );
}
