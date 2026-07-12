import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: '/',
  timeout: 10000
});

export const httpClient = {
  get: (url: string) => axiosInstance.get(url),
  post: (url: string, data?: any) => axiosInstance.post(url, data),
  put: (url: string, data?: any) => axiosInstance.put(url, data),
  delete: (url: string) => axiosInstance.delete(url)
};