import {
  ValidationError,
  AuthenticationError,
  ConflictError,
  ServerError,
  TimeoutError,
  NetworkError
} from './errors';

export function transformAxiosError(error: any): Error {
  if (!error) {
    return new NetworkError('Unknown network error');
  }

  if (error.code === 'ECONNABORTED' || (error.message && error.message.includes('timeout'))) {
    return new TimeoutError(error.message || 'Request timed out');
  }

  const response = error.response;
  if (!response) {
    return new NetworkError(error.message || 'Network connectivity issue');
  }

  const status = response.status;
  const data = response.data || {};
  const errorMessage = data.error?.message || error.message || 'API Request failed';

  switch (status) {
    case 400:
      return new ValidationError(errorMessage, data.error?.validationErrors);
    case 401:
    case 403:
      return new AuthenticationError(errorMessage);
    case 409:
      return new ConflictError(errorMessage);
    case 500:
    case 502:
    case 503:
    case 504:
      return new ServerError(errorMessage, status);
    default:
      return new ServerError(errorMessage, status);
  }
}