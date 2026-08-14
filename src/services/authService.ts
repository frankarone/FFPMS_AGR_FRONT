import { apiPost } from './repository/apiClient';
import type { LoginResponse } from '../types/auth';

export function login(userName: string, password: string) {
  return apiPost<LoginResponse>('/api/login', { userName, password });
}