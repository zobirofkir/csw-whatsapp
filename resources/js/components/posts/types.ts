export interface MediaItem {
    id: number;
    url: string;
    type: 'image' | 'video';
}

export interface Comment {
    id: number;
    content: string;
    user: {
        name: string;
        avatar: string;
    };
    timestamp: string;
    reactions: {
        type: string;
        count: number;
    }[];
    userReaction?: string;
    replies: Comment[];
    parent_id?: number;
}

export interface ReactionCounts {
    [key: string]: number;
}

export interface PostProps {
    post: {
        id: number;
        user: {
            name: string;
            avatar: string;
            timestamp: string;
        };
        content: string;
        media: MediaItem[];
        likes: number;
        hasReacted: boolean;
        userReaction?: string;
        reactionCounts: ReactionCounts;
        comments: Comment[];
    };
}

export const REACTIONS = {
    like: '👍',
    love: '❤️',
    haha: '😂',
    wow: '😮',
    sad: '😢',
    angry: '😠',
} as const;
