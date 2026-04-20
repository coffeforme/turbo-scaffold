import { HttpProvider } from '../types';

export class FetchHttpProvider implements HttpProvider {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    method: string,
    url: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> {
    const fullUrl = `${this.baseUrl}${url}`;
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(fullUrl, config);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const contentType = response.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
      return response.json();
    }

    return (await response.text()) as T;
  }

  async get<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>('GET', url, undefined, options);
  }

  async post<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>('POST', url, data, options);
  }

  async put<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>('PUT', url, data, options);
  }

  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>('DELETE', url, undefined, options);
  }
}
