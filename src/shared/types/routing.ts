import { ReactNode } from 'react';

export interface RouteMetadata {
  title: string;
  permissions?: string[];
  roles?: string[];
  featureFlag?: string;
  breadcrumb?: string;
}

export interface RouteConfig {
  path: string;
  element: ReactNode;
  metadata?: RouteMetadata;
  children?: RouteConfig[];
}