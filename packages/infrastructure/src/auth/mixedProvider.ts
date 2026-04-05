import { MsalAuthProvider } from './msalProvider';
import { BackendAuthProvider } from './backendProvider';
import { AuthProvider } from '../types';
import { Configuration } from '@azure/msal-browser';

export class MixedAuthProvider implements AuthProvider {
  private msalProvider: MsalAuthProvider | null = null;
  private backendProvider: BackendAuthProvider;
  private useMsal: boolean;

  constructor(
    backendBaseUrl: string,
    msalConfig?: Configuration,
    useMsal: boolean = false
  ) {
    this.backendProvider = new BackendAuthProvider(backendBaseUrl);
    this.useMsal = useMsal;

    if (useMsal && msalConfig) {
      this.msalProvider = new MsalAuthProvider(msalConfig);
    }
  }

  async initialize(): Promise<void> {
    if (this.msalProvider) {
      await this.msalProvider.initialize();
    }
  }

  async login(credentials?: { username: string; password: string }): Promise<any> {
    if (this.useMsal && this.msalProvider) {
      return this.msalProvider.login();
    } else if (credentials) {
      return this.backendProvider.login(credentials);
    } else {
      throw new Error('Credentials required for backend authentication');
    }
  }

  async logout(): Promise<void> {
    if (this.useMsal && this.msalProvider) {
      await this.msalProvider.logout();
    } else {
      await this.backendProvider.logout();
    }
  }

  async getToken(): Promise<string> {
    if (this.useMsal && this.msalProvider) {
      return this.msalProvider.getToken();
    } else {
      const token = this.backendProvider.getToken();
      if (!token) {
        throw new Error('No token available');
      }
      return token;
    }
  }

  isAuthenticated(): boolean {
    if (this.useMsal && this.msalProvider) {
      return this.msalProvider.isAuthenticated();
    } else {
      return this.backendProvider.isAuthenticated();
    }
  }
}