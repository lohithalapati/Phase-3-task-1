import { createHttpClient } from './httpClient';
import { requestInterceptor } from '../interceptors/request';
import { responseSuccessInterceptor, responseErrorInterceptor } from '../interceptors/response';

const client = createHttpClient();

client.interceptors.request.use(
  (config) => requestInterceptor(config) as any,
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => responseSuccessInterceptor(response),
  async (error) => responseErrorInterceptor(error, client)
);

export const apiClient = client;
