interface ShareDialogProps {
    postId: number;
    show: boolean;
    onClose: () => void;
}

export const ShareDialog = ({ postId, show, onClose }: ShareDialogProps) => {
    if (!show) return null;

    const copyToClipboard = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const postUrl = `${window.location.origin}/posts/${postId}`;

        try {
            await navigator.clipboard.writeText(postUrl);
            alert('Link copied to clipboard!');
            onClose();
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    return (
        <div
            className="backdrop-blur fixed inset-0 z-50 flex items-center justify-center"
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
        >
            {/* ... existing share dialog JSX ... */}
        </div>
    );
};
