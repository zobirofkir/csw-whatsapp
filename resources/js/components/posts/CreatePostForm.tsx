import { MediaItem, PageProps } from '@/types/post';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { useRef, useState } from 'react';
import { MediaPreview } from './MediaPreview';
import { PostActionButton } from './PostActionButton';

// Constants
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/avi'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const COMMON_EMOJIS = ['😀', '😊', '👍', '❤️', '😂', '🎉', '🔥', '👋', '😎', '🤔'];

export default function CreatePostForm() {
    // State
    const [postContent, setPostContent] = useState('');
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [feeling, setFeeling] = useState('');
    const [activity, setActivity] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showEmojis, setShowEmojis] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get user data from page props
    const { auth } = usePage<PageProps>().props;

    // Media handling functions
    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setUploadError(null);
        const newMediaItems: MediaItem[] = [];

        files.forEach((file) => {
            if (file.size > MAX_FILE_SIZE) {
                setUploadError('Each file size should not exceed 5MB');
                return;
            }

            const type = ALLOWED_IMAGE_TYPES.includes(file.type) ? 'image' : ALLOWED_VIDEO_TYPES.includes(file.type) ? 'video' : null;

            if (!type) {
                setUploadError('Please upload only images (JPG, PNG, GIF) or videos (MP4, MOV, AVI)');
                return;
            }

            newMediaItems.push({
                file,
                preview: URL.createObjectURL(file),
                type,
            });
        });

        setMediaItems((prev) => [...prev, ...newMediaItems]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeMedia = (index: number) => {
        setMediaItems((prev) => {
            const newItems = [...prev];
            URL.revokeObjectURL(newItems[index].preview);
            newItems.splice(index, 1);
            return newItems;
        });
    };

    // Form submission
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
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            resetForm();
        } catch (error) {
            console.error('Error creating post:', error);
            setUploadError('Failed to create post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setPostContent('');
        mediaItems.forEach((item) => URL.revokeObjectURL(item.preview));
        setMediaItems([]);
        setFeeling('');
        setActivity('');
        setIsEditing(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setUploadError(null);
    };

    // Render functions
    const renderProfileSection = () => (
        <div className="mb-3 flex items-center space-x-2">
            <img src={getAvatarUrl(auth.user.avatar)} alt={auth.user.name} className="h-10 w-10 rounded-full border border-gray-200" />
            {!isEditing ? (
                <button
                    onClick={() => setIsEditing(true)}
                    className="flex-grow rounded-full bg-gray-100 px-4 py-2.5 text-left text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                    What's on your mind?
                </button>
            ) : (
                <div className="font-medium">{auth.user.name}</div>
            )}
        </div>
    );

    return (
        <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            {renderProfileSection()}

            {isEditing && (
                <textarea
                    className="w-full resize-none rounded-lg border-0 bg-transparent p-3 text-black focus:ring-0 dark:text-white"
                    placeholder="What's on your mind?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    rows={3}
                    autoFocus
                />
            )}

            {mediaItems.length > 0 && <MediaPreview mediaItems={mediaItems} onRemove={removeMedia} />}

            {uploadError && <div className="mt-2 text-sm text-red-500">{uploadError}</div>}

            <div className="my-3 border-b border-gray-300 dark:border-gray-700" />

            <div className="flex items-center justify-between">
                <div className="grid w-full grid-cols-2 md:flex md:space-x-1">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleMediaChange}
                        accept={[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(',')}
                        className="hidden"
                        multiple
                    />
                    <PostActionButton icon="photo" text="Photo/Video" onClick={() => fileInputRef.current?.click()} />
                    <PostActionButton icon="emoji" text="Feeling/Activity" onClick={() => setShowEmojis(!showEmojis)} />
                </div>
            </div>

            {isEditing && (
                <button
                    className={`mt-3 w-full rounded-lg px-4 py-2 font-semibold text-white transition-colors ${
                        isLoading || !postContent.trim() ? 'cursor-not-allowed bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    onClick={handleSubmit}
                    disabled={isLoading || !postContent.trim()}
                >
                    {isLoading ? 'Posting...' : 'Post'}
                </button>
            )}

            {showEmojis && (
                <div className="absolute z-10 mt-2 rounded-lg border bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <div className="grid grid-cols-5 gap-2">
                        {COMMON_EMOJIS.map((emoji) => (
                            <button
                                key={emoji}
                                onClick={() => setPostContent((prev) => prev + emoji)}
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

function getAvatarUrl(avatar: string): string {
    if (!avatar) return '';
    return avatar.startsWith('http') ? avatar : `/storage/${avatar}`;
}
