import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { HttpProvider } from '../types';

export class AxiosHttpProvider implements HttpProvider {
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string, config?: AxiosRequestConfig) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      ...config,
    });
  }

  async get<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get(url, options);
    return response.data;
  }

  async post<T>(url: string, data?: any, options?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post(url, data, options);
    return response.data;
  }

  async put<T>(url: string, data?: any, options?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put(url, data, options);
    return response.data;
  }

  async delete<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete(url, options);
    return response.data;
  }
}