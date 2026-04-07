import { AuthProvider } from '../types';

export class BackendAuthProvider implements AuthProvider {
  private token: string | null = null;
  private refreshTokenValue: string | null = null;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async login(credentials: { username: string; password: string }): Promise<{ token: string; user: any }> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.json();
    this.token = data.token;
    this.refreshTokenValue = data.refreshToken;

    return data;
  }

  async logout(): Promise<void> {
    if (this.token) {
      await fetch(`${this.baseUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });
    }
    this.token = null;
    this.refreshTokenValue = null;
  }

  async getToken(): Promise<string> {
    const token = this.token;
    if (!token) {
      throw new Error('No token available');
    }
    return token;
  }

  async refreshToken(): Promise<string> {
    if (!this.refreshTokenValue) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: this.refreshTokenValue }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    this.token = data.token;
    this.refreshTokenValue = data.refreshToken;

    return this.token!;
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }
}