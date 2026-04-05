// Shared API utilities
export const apiBaseUrl = 'https://api.example.com';

// Placeholder for API client
export const apiClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`${apiBaseUrl}${endpoint}`);
    return response.json();
  },
  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};