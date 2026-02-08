import apiClient from './axios';

export interface InstructorApplication {
  id: string;
  userId: string;
  bio: string;
  experienceYears: string;
  teachingExperience: string;
  courseIntent: string;
  level: string;
  language: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListApplicationsResponse {
  applications: InstructorApplication[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const adminApi = {
  listApplications(params?: {
    page?: number;
    limit?: number;
    status?: 'pending' | 'approved' | 'rejected';
  }): Promise<{ data: ListApplicationsResponse }> {
    return apiClient.get('/instructor/applications', { params });
  },

  approveApplication(applicationId: string) {
    return apiClient.post(`/instructor/applications/${applicationId}/approve`);
  },

  rejectApplication(applicationId: string, reason?: string) {
    return apiClient.post(`/instructor/applications/${applicationId}/reject`, {
      reason,
    });
  },
};