export type ErrorCategory = 
  | 'NETWORK_ERROR' 
  | 'TIMEOUT_ERROR' 
  | 'UNAUTHORIZED' 
  | 'FORBIDDEN' 
  | 'NOT_FOUND' 
  | 'VALIDATION_ERROR' 
  | 'SERVER_ERROR' 
  | 'BAD_REQUEST' 
  | 'CANCELED' 
  | 'UNKNOWN';

export interface ApiErrorPayload {
  message: string;
  category: ErrorCategory;
  status?: number;
  code?: string;
  correlationId?: string;
  details?: Record<string, any>;
  timestamp: string;
}
