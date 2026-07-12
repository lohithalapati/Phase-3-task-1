import { useState, useEffect, useCallback, useRef } from 'react';
import { AxiosRequestConfig } from 'axios';
import { httpClient } from '../client/http-client';
import { ApiError } from '../errors/api-errors';
import { PageRequest } from '../models/api.models';

export interface HookOptions {
  immediate?: boolean;
  skipCancellation?: boolean;
}

export interface MutationOptions<T, R> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  onSettled?: (data?: T, error?: ApiError) => void;
}

export function useApi() {
  return { client: httpClient };
}

export function useQuery<T>(url: string, config?: AxiosRequestConfig, options: HookOptions = { immediate: true }) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(options.immediate ?? true);
  const [error, setError] = useState<ApiError | null>(null);
  const activeAbortController = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (overrideConfig?: AxiosRequestConfig): Promise<T> => {
      setLoading(true);
      setError(null);

      if (!options.skipCancellation && activeAbortController.current) {
        activeAbortController.current.abort();
      }

      const controller = new AbortController();
      activeAbortController.current = controller;

      try {
        const mergedConfig: AxiosRequestConfig = {
          ...config,
          ...overrideConfig,
          signal: controller.signal,
        };

        const result = await httpClient.get<T>(url, mergedConfig);
        setData(result.data);
        return result.data;
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err);
        } else if (!(err instanceof Error && err.name === 'CanceledError')) {
          setError(new ApiError('An unexpected client side error occurred.', { rawError: err }));
        }
        throw err;
      } finally {
        if (activeAbortController.current === controller) {
          setLoading(false);
        }
      }
    },
    [url, config, options.skipCancellation]
  );

  useEffect(() => {
    if (options.immediate) {
      execute().catch(() => {});
    }
    return () => {
      if (!options.skipCancellation && activeAbortController.current) {
        activeAbortController.current.abort();
      }
    };
  }, [execute, options.immediate, options.skipCancellation]);

  return { data, loading, error, execute, setData };
}

export function useMutation<T, R = unknown>(
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  config?: AxiosRequestConfig,
  mutationOpts?: MutationOptions<T, R>
) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const mutate = useCallback(
    async (payload: R, overrideConfig?: AxiosRequestConfig): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        let result: { data: T };
        const mergedConfig = { ...config, ...overrideConfig };

        switch (method) {
          case 'POST':
            result = await httpClient.post<T, R>(url, payload, mergedConfig);
            break;
          case 'PUT':
            result = await httpClient.put<T, R>(url, payload, mergedConfig);
            break;
          case 'PATCH':
            result = await httpClient.patch<T, R>(url, payload, mergedConfig);
            break;
          case 'DELETE':
            result = await httpClient.delete<T>(url, mergedConfig);
            break;
        }

        const data = result.data;
        mutationOpts?.onSuccess?.(data);
        mutationOpts?.onSettled?.(data, undefined);
        return data;
      } catch (err) {
        const apiErr =
          err instanceof ApiError
            ? err
            : new ApiError('An error occurred executing mutation.', { rawError: err });
        setError(apiErr);
        mutationOpts?.onError?.(apiErr);
        mutationOpts?.onSettled?.(undefined, apiErr);
        throw apiErr;
      } finally {
        setLoading(false);
      }
    },
    [method, url, config, mutationOpts]
  );

  return { mutate, loading, error };
}

export function useUpload<T>(url: string) {
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const upload = useCallback(
    async (file: File, fieldName = 'file', additionalFields?: Record<string, string>): Promise<T> => {
      setLoading(true);
      setError(null);
      setProgress(0);

      try {
        const result = await httpClient.upload<T>(
          url,
          file,
          fieldName,
          additionalFields,
          (percent) => setProgress(percent)
        );
        return result.data;
      } catch (err) {
        const apiErr =
          err instanceof ApiError ? err : new ApiError('Upload sequence failure.', { rawError: err });
        setError(apiErr);
        throw apiErr;
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  return { upload, progress, loading, error };
}

export function useDownload(url: string) {
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const download = useCallback(
    async (filename: string, config?: AxiosRequestConfig): Promise<void> => {
      setLoading(true);
      setError(null);
      setProgress(0);

      try {
        const blob = await httpClient.download(url, config, (percent) => setProgress(percent));
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
      } catch (err) {
        const apiErr =
          err instanceof ApiError ? err : new ApiError('Download sequence failure.', { rawError: err });
        setError(apiErr);
        throw apiErr;
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  return { download, progress, loading, error };
}

export function usePagination<T>(url: string, initialRequest: PageRequest = { page: 1, limit: 10 }) {
  const [pageParams, setPageParams] = useState<PageRequest>(initialRequest);
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  const buildParams = useCallback((params: PageRequest) => {
    const configParams: Record<string, unknown> = {
      page: params.page,
      limit: params.limit,
    };
    if (params.sort) {
      configParams.sort = params.sort.map((s) => `${s.field}:${s.direction}`).join(',');
    }
    if (params.filters) {
      params.filters.forEach((f) => {
        configParams[`filter_${f.field}`] = `${f.operator}:${f.value}`;
      });
    }
    return configParams;
  }, []);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await httpClient.getPaginated<T>(url, { params: buildParams(pageParams) });
      setData(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalCount(response.pagination.totalCount);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err);
      } else {
        setError(new ApiError('Pagination query failed.', { rawError: err }));
      }
    } finally {
      setLoading(false);
    }
  }, [url, pageParams, buildParams]);

  useEffect(() => {
    execute();
  }, [execute]);

  const updatePage = useCallback((newPage: number) => {
    setPageParams((prev) => ({ ...prev, page: newPage }));
  }, []);

  const updateLimit = useCallback((newLimit: number) => {
    setPageParams((prev) => ({ ...prev, page: 1, limit: newLimit }));
  }, []);

  return {
    items: data,
    loading,
    error,
    currentPage: pageParams.page || 1,
    limit: pageParams.limit || 10,
    totalPages,
    totalCount,
    updatePage,
    updateLimit,
    refresh: execute,
  };
}