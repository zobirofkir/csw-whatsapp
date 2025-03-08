export interface Post {
    id: number;
    content: string;
    created_at?: string;
    user: {
        name: string;
        avatar: string;
    };
    media: {
        id: number;
        url: string;
        type: 'image' | 'video';
    }[];
    likes: number;
    user_reaction?: string;
    reaction_counts?: Record<string, number>;
    comments: {
        id: number;
        content: string;
        created_at?: string;
        user: {
            name: string;
            avatar: string;
        };
        reactions?: {
            type: string;
            count: number;
        }[];
        replies?: any[];
    }[];
}

export interface SharedData {
    auth: {
        user: {
            id: number;
            name: string;
            avatar: string | null;
            cover_photo?: string;
        };
    };
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface PostType {
    id: number;
    content: string;
    created_at?: string;
    user: {
        name: string;
        avatar: string;
    };
    media: {
        id: number;
        url: string;
        type: 'image' | 'video';
    }[];
    likes: number;
    user_reaction?: string;
    reaction_counts?: Record<string, number>;
    comments: {
        id: number;
        content: string;
        created_at?: string;
        user: {
            name: string;
            avatar: string;
        };
        reactions?: {
            type: string;
            count: number;
        }[];
        replies?: any[];
    }[];
}
