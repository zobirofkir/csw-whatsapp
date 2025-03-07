import { PageProps as InertiaPageProps } from '@inertiajs/core';

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

export interface PageProps extends InertiaPageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            avatar: string;
        };
    };
    [key: string]: any;
}
