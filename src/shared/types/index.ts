import React from 'react';

export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  status: number;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  details?: Record<string, string[]>;
}

export interface BaseComponentProps {
  children?: React.ReactNode;
  className?: string;
}

export interface UserSession {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
}
