import { FormDataType, PageProps, PostType, SharedData } from '@/types';

export interface ProfileForm extends FormDataType {
    name: string;
    avatar: File | null;
    cover_photo: File | null;
    _method: string;
}

export interface ProfilePageProps extends PageProps {
    auth: SharedData['auth'];
    userPosts: PostType[];
}

export interface IntroForm {
    bio: string;
    work?: string;
    education?: string;
    location?: string;
    relationship?: string;
}
