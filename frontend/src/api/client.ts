/**
 * Enterprise HTTP Client (HttpClient)
 *
 * A centralized, strongly-typed HTTP request manager designed for high reliability,
 * automatic CSRF header injection, transparent JSON processing, and unified exception handling.
 */

export interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  code?: string;
  errors?: string[];
  [key: string]: any;
}

export class ApiError extends Error {
  public status: number;
  public code?: string;
  public errors?: string[];

  constructor(message: string, status: number, code?: string, errors?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

class HttpClient {
  private baseURL: string = '/api';
  private csrfBootstrapped = false;

  /**
   * Helper to retrieve cookies on the client-side safely
   */
  private getCookie(name: string): string {
    if (typeof document === 'undefined') return '';
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
    return '';
  }

  /**
   * Lazily bootstrap CSRF token — only called before first state-changing request.
   * If backend is down, silently skip (request will fail naturally).
   */
  private async ensureCsrf(): Promise<void> {
    if (this.csrfBootstrapped) return;
    if (this.getCookie('csrfToken')) {
      this.csrfBootstrapped = true;
      return;
    }
    try {
      await fetch(`${this.baseURL}/auth/csrf-token`, { method: 'GET', credentials: 'include' });
    } catch {
      // Backend unavailable — CSRF will be skipped, requests fail on their own
    }
    this.csrfBootstrapped = true;
  }

  /**
   * Dispatches custom DOM events for UI progress bars or loading indicators
   */
  private dispatchProgress(type: 'start' | 'end') {
    if (typeof window !== 'undefined') {
      const eventName = type === 'start' ? 'global-progress-start' : 'global-progress-end';
      window.dispatchEvent(new CustomEvent(eventName));
    }
  }

  /**
   * Core request runner with unified logging, headers orchestration, and automatic CSRF handling.
   */
  private async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    this.dispatchProgress('start');

    // Build URL with optional query parameters
    let url = endpoint.startsWith('/') ? `${this.baseURL}${endpoint}` : `${this.baseURL}/${endpoint}`;
    if (options.params) {
      const searchParams = new URLSearchParams(options.params);
      url += `?${searchParams.toString()}`;
    }

    // Default headers setup
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    // Automatically inject double-submit CSRF protection for modifying requests
    const method = (options.method || 'GET').toUpperCase();
    if (method !== 'GET' && method !== 'HEAD') {
      await this.ensureCsrf();
      const csrfToken = this.getCookie('csrfToken');
      if (csrfToken) {
        headers.set('X-CSRF-Token', csrfToken);
      }
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : null;

      if (!response.ok) {
        const errorMsg = data?.message || `HTTP request failed with status ${response.status}`;
        const errorCode = data?.code || 'HTTP_ERROR';
        const errorList = data?.errors || [];
        throw new ApiError(errorMsg, response.status, errorCode, errorList);
      }

      return data as T;
    } catch (error) {
      // Direct telemetry / logging
      console.error(`[API CLIENT ERROR] ${method} ${url}:`, error);
      throw error;
    } finally {
      this.dispatchProgress('end');
    }
  }

  public async get<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public async post<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public async put<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public async delete<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new HttpClient();
