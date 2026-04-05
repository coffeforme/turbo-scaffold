// Shared interfaces for infrastructure providers

export interface HttpProvider {
  get<T>(url: string, options?: any): Promise<T>;
  post<T>(url: string, data?: any, options?: any): Promise<T>;
  put<T>(url: string, data?: any, options?: any): Promise<T>;
  delete<T>(url: string, options?: any): Promise<T>;
}

export interface AuthProvider {
  login(credentials?: any): Promise<any>;
  logout(): Promise<void>;
  getToken(): Promise<string>;
  isAuthenticated(): boolean;
}