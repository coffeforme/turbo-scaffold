import { PublicClientApplication, Configuration, AuthenticationResult, AccountInfo } from '@azure/msal-browser';
import { AuthProvider } from '../types';

export class MsalAuthProvider implements AuthProvider {
  private msalInstance: PublicClientApplication;
  private account: AccountInfo | null = null;

  constructor(config: Configuration) {
    this.msalInstance = new PublicClientApplication(config);
  }

  async initialize(): Promise<void> {
    await this.msalInstance.initialize();
    const accounts = this.msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      this.account = accounts[0];
    }
  }

  async login(): Promise<AuthenticationResult> {
    const loginRequest = {
      scopes: ['user.read'],
    };

    const response = await this.msalInstance.loginPopup(loginRequest);
    this.account = response.account;
    return response;
  }

  async logout(): Promise<void> {
    await this.msalInstance.logoutPopup();
    this.account = null;
  }

  async getToken(): Promise<string> {
    if (!this.account) {
      throw new Error('No account available. Please login first.');
    }

    const tokenRequest = {
      scopes: ['user.read'],
      account: this.account,
    };

    const response = await this.msalInstance.acquireTokenSilent(tokenRequest);
    return response.accessToken;
  }

  getAccount(): AccountInfo | null {
    return this.account;
  }

  isAuthenticated(): boolean {
    return this.account !== null;
  }
}