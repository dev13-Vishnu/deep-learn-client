import apiClient from './axios';

export interface InstructorApplicationPayload {
  bio: string;
  experienceYears: string;
  teachingExperience: 'yes' | 'no';
  courseIntent: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
}

export async function applyForInstructor(
  payload: InstructorApplicationPayload
) {
  const { data } = await apiClient.post('/instructor/apply', payload);
  return data;
}

export async function getInstructorStatus():Promise<{
  status: 'pending' | 'approved' | 'rejected' | 'blocked' | null;
}> {
  try {
    console.log('[Instructor API] Fetching instructor status');
    const { data } = await apiClient.get('/instructor/status');
    console.log('[Instructor API] Response:', data);
    return data;
  } catch (error) {
    console.error("[Instructor API] Failed to fetch status", error);
    throw error;
  }
}
