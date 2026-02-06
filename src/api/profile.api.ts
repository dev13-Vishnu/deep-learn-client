import apiClient from "./axios";

export interface UserProfile {
    firstName : string | null;
    lastName: string | null;
    bio: string | null;
    avatarUrl: string | null;
}

export async function getMyProfile(): Promise<UserProfile> {
    const { data } = await apiClient.get('/auth/me');
    return data.user.profile;
}

export async function updateMyProfile(input:{
    firstName?: string;
    lastName?: string;
    bio?: string;
}): Promise<void> {
    await apiClient.patch('/user/me/profile', input);
}