import { apiClient } from './client';
import { User } from '../types';

export interface AuthResponse {
  status: 'success';
  message: string;
  token?: string;
  user: User;
}

export interface ResetRequestResponse {
  status: 'success';
  message: string;
  debugToken?: string;
}

export interface ResetConfirmResponse {
  status: 'success';
  message: string;
}

export class AuthService {
  /**
   * Fetches the current authenticated user's session
   */
  static async getCurrentUser(): Promise<AuthResponse> {
    return apiClient.get<AuthResponse>('/auth/me');
  }

  /**
   * Performs authentication login
   */
  static async login(body: any): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/secure-login', body);
  }

  /**
   * Performs high-security role-based registration
   */
  static async register(body: any): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/secure-register', body);
  }

  /**
   * Performs secure session sign-out
   */
  static async logout(): Promise<{ status: 'success'; message: string }> {
    return apiClient.post<{ status: 'success'; message: string }>('/auth/secure-logout');
  }

  /**
   * Bootstraps a fresh double-submit CSRF token
   */
  static async bootstrapCsrf(): Promise<{ status: 'success'; csrfToken: string }> {
    return apiClient.get<{ status: 'success'; csrfToken: string }>('/auth/csrf-token');
  }

  /**
   * Submits a request to reset password
   */
  static async requestPasswordReset(email: string): Promise<ResetRequestResponse> {
    return apiClient.post<ResetRequestResponse>('/auth/reset-password-request', { email });
  }

  /**
   * Confirms password reset with an validated JWT token
   */
  static async confirmPasswordReset(body: any): Promise<ResetConfirmResponse> {
    return apiClient.post<ResetConfirmResponse>('/auth/reset-password-confirm', body);
  }
}
