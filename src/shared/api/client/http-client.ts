import { AxiosRequestConfig, AxiosProgressEvent } from 'axios';
import { axiosInstance } from './axios-instance';
import { ApiResponse, ApiPaginatedResponse } from '../models/api.models';

export class HttpClient {
  private static instance: HttpClient;

  private constructor() {}

  public static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await axiosInstance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  public async getPaginated<T>(url: string, config?: AxiosRequestConfig): Promise<ApiPaginatedResponse<T>> {
    const response = await axiosInstance.get<ApiPaginatedResponse<T>>(url, config);
    return response.data;
  }

  public async post<T, R = unknown>(url: string, data?: R, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await axiosInstance.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async put<T, R = unknown>(url: string, data?: R, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await axiosInstance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async patch<T, R = unknown>(url: string, data?: R, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await axiosInstance.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await axiosInstance.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  public async upload<T>(
    url: string,
    file: File,
    fieldName = 'file',
    additionalFields?: Record<string, string>,
    onProgress?: (progressPercentage: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append(fieldName, file);

    if (additionalFields) {
      Object.entries(additionalFields).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return this.post<T, FormData>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }

  public async download(
    url: string,
    config?: AxiosRequestConfig,
    onProgress?: (progressPercentage: number) => void
  ): Promise<Blob> {
    const response = await axiosInstance.get<Blob>(url, {
      ...config,
      responseType: 'blob',
      onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data;
  }
}

export const httpClient = HttpClient.getInstance();