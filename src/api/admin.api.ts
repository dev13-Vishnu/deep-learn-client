import apiClient from './axios';

export interface InstructorApplicationApplicant {
  firstName: string | null;
  lastName: string | null;
  email: string;
  avatarUrl: string | null;
}

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
  cooldownExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  /** Applicant's user profile — populated by the server, null if user was deleted */
  applicant: InstructorApplicationApplicant | null;
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

export interface RejectApplicationResult {
  message: string;
  cooldown: {
    expiresAt: string;
    durationDays: number;
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