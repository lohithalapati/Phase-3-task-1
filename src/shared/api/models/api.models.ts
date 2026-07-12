export interface ApiResponse<T> {
  data: T;
  meta: ResponseMetadata;
}

export interface ResponseMetadata {
  timestamp: string;
  traceId: string;
  correlationId: string;
  durationMs?: number;
}

export interface ApiPaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMetadata;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PageRequest {
  page?: number;
  limit?: number;
  sort?: SortRequest[];
  filters?: FilterRequest[];
}

export interface SortRequest {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterRequest {
  field: string;
  operator: 'eq' | 'neq' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'in';
  value: unknown;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    validationErrors?: Record<string, string[]>;
    traceId: string;
  };
}