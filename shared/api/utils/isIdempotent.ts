import { HttpMethod } from '../types/http';

export function isIdempotentRequest(method?: string): boolean {
  if (!method) return false;
  const upperMethod = method.toUpperCase() as HttpMethod;
  return ['GET', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'].includes(upperMethod);
}
