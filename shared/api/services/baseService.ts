import { AxiosInstance } from 'axios';
import { apiClient } from '../client/apiClient';
import { ExtendedRequestConfig } from '../types/api';

export class BaseService {
  protected client: AxiosInstance;

  constructor(customClient: AxiosInstance = apiClient) {
    this.client = customClient;
  }

  protected async get<T>(url: string, config?: ExtendedRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  protected async post<T>(url: string, data?: any, config?: ExtendedRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  protected async put<T>(url: string, data?: any, config?: ExtendedRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  protected async delete<T>(url: string, config?: ExtendedRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  protected async patch<T>(url: string, data?: any, config?: ExtendedRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }
}
