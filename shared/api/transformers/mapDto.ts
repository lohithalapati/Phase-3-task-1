import { ApiResponseDto } from '../dto/response/BaseResponseDto';

export function mapResponseDto<T, R>(
  response: ApiResponseDto<T>,
  transformFn: (data: T) => R
): ApiResponseDto<R> {
  return {
    ...response,
    data: transformFn(response.data),
  };
}
