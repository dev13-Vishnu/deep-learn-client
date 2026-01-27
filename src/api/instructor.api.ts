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

export async function getInstructorStatus() {
  const { data } = await apiClient.get('/instructor/status');
  return data;
}
