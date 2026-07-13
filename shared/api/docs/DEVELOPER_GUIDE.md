
API Integration Developer Guide
Follow this guide to make requests in your feature services.

1. Define your Service Class
TypeScript

import { BaseService } from 'shared/api/services/baseService';
import { API_ENDPOINTS } from 'shared/api/endpoints/registry';
import { ApiResponseDto } from 'shared/api/dto';

export class AccountService extends BaseService {
  public async getProfile(): Promise<ApiResponseDto<any>> {
    return this.get<ApiResponseDto<any>>(API_ENDPOINTS.USER.PROFILE);
  }
}
2. Bypass Retries manually
If a request must fail fast without retrying, set the skipRetry flag:

TypeScript

this.get(url, { skipRetry: true });
