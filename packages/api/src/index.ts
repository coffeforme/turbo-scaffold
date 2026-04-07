import { HttpProvider, FetchHttpProvider, AxiosHttpProvider } from '@repo/infrastructure';

// Shared API utilities
export const apiBaseUrl = 'https://jsonplaceholder.typicode.com';

// API client that uses an HttpProvider
export class ApiClient {
  private httpProvider: HttpProvider;

  constructor(httpProvider: HttpProvider) {
    this.httpProvider = httpProvider;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.httpProvider.get<T>(endpoint);
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.httpProvider.post<T>(endpoint, data);
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.httpProvider.put<T>(endpoint, data);
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.httpProvider.delete<T>(endpoint);
  }
}

// HTTP Provider types
export type HttpProviderType = 'fetch' | 'axios';

// Factory function to create API client with specified provider
export const createApiClient = (
  baseUrl: string = apiBaseUrl,
  providerType: HttpProviderType = 'fetch'
) => {
  let httpProvider: HttpProvider;

  switch (providerType) {
    case 'axios':
      httpProvider = new AxiosHttpProvider(baseUrl);
      break;
    case 'fetch':
    default:
      httpProvider = new FetchHttpProvider(baseUrl);
      break;
  }

  return new ApiClient(httpProvider);
};

// Convenience factory functions for specific providers
export const createFetchApiClient = (baseUrl: string = apiBaseUrl) => {
  return createApiClient(baseUrl, 'fetch');
};

export const createAxiosApiClient = (baseUrl: string = apiBaseUrl) => {
  return createApiClient(baseUrl, 'axios');
};

// Factory function that accepts a custom HttpProvider instance
export const createApiClientWithProvider = (httpProvider: HttpProvider) => {
  return new ApiClient(httpProvider);
};

// Backward compatibility - default instance using fetch
export const apiClient = createApiClient();