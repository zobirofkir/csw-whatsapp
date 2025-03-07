export interface MediaItem {
    file: File;
    preview: string;
    type: 'image' | 'video';
}

export interface User {
    id: number;
    name: string;
    avatar: string;
}

export interface PageProps {
    auth: {
        user: User;
    };
}
