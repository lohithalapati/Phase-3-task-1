import axios, { AxiosInstance } from 'axios';
import { apiConfig } from '../config/apiConfig';

let instance: AxiosInstance | null = null;

export function createHttpClient(): AxiosInstance {
  if (instance) return instance;

  instance = axios.create({
    baseURL: apiConfig.baseUrl,
    timeout: apiConfig.timeout,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  return instance;
}
