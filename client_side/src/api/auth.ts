import api from './client';
import type { User } from '../types/index';

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  email?: string;
  password: string;
  first_name: string;
  phone: string;
}

export const authAPI = {
  login: (data: LoginData) => api.post<LoginResponse>('/auth/login/', data),
  
  signup: (data: SignupData) => api.post('/auth/register/', data),
  
  me: () => api.get<User>('/auth/me/'),
  
  // Future APIs go here too
  getReports: () => api.get('/reports/'),
  createReport: (data: any) => api.post('/reports/', data),
  uploadEvidence: (reportId: number, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post(`/reports/${reportId}/upload_evidence/`, form);
  },
  assessRisk: (reportId: number, answers: Record<string, boolean>) =>
    api.post('/risk/assess/', { report_id: reportId, answers }),
  moderateText: (text: string) => api.post('/moderation/check-text/', { text }),
  sendChatMessage: (message: string, sessionId?: string) =>
    api.post('/chatbot/message/', { message }, {
      headers: sessionId ? { 'X-Session-ID': sessionId } : {}
    }),
  getHotlines: (country = 'KE') => api.get(`/support/hotlines/?country=${country}`),
};