import apiClient from './axios';

export interface ProfileData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: number;
  createdAt: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  bio?: string;
}

export const profileApi = {
  getProfile(): Promise<{ data: ProfileData }> {
    return apiClient.get('/profile');
  },

  updateProfile(data: UpdateProfileData) {
    return apiClient.patch('/profile', data);
  },

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteAvatar() {
    return apiClient.delete('/profile/avatar');
  },
};