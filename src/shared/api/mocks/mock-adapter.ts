import { MOCK_USER, MOCK_PROJECTS, MOCK_DASHBOARD_METRICS, MOCK_AI_TRANSCRIPTION } from './mock-data';
import { ENDPOINT_REGISTRY } from '../config/endpoints';

export class MockAdapter {
  private static readonly LATENCY_MS = 600;

  public static isMockable(url: string): boolean {
    const cleanUrl = url.split('?')[0];
    return (
      cleanUrl.endsWith(ENDPOINT_REGISTRY.auth.login) ||
      cleanUrl.endsWith(ENDPOINT_REGISTRY.auth.me) ||
      cleanUrl.endsWith(ENDPOINT_REGISTRY.users.profile) ||
      cleanUrl.includes(ENDPOINT_REGISTRY.projects.base) ||
      cleanUrl.endsWith(ENDPOINT_REGISTRY.dashboard.metrics) ||
      cleanUrl.endsWith(ENDPOINT_REGISTRY.ai.transcribe)
    );
  }

  public static async executeMockRequest(url: string, method: string, data?: unknown): Promise<unknown> {
    await new Promise((resolve) => setTimeout(resolve, this.LATENCY_MS));
    const cleanUrl = url.split('?')[0];

    const traceId = `trc_${Math.random().toString(36).substring(2, 10)}`;
    const correlationId = `corr_${Math.random().toString(36).substring(2, 10)}`;
    const timestamp = new Date().toISOString();

    const _method = method.toUpperCase();
    const _payload = data ? JSON.stringify(data) : 'empty';
    console.debug(`[MockAdapter] ${_method} Request Matched for ${cleanUrl} with Payload: ${_payload}`);

    const buildEnvelope = (payload: unknown) => ({
      data: payload,
      meta: { timestamp, traceId, correlationId }
    });

    if (cleanUrl.endsWith(ENDPOINT_REGISTRY.auth.login)) {
      return buildEnvelope({
        accessToken: "mock_jwt_access_token_nh5",
        refreshToken: "mock_jwt_refresh_token_nh5",
        user: MOCK_USER
      });
    }

    if (cleanUrl.endsWith(ENDPOINT_REGISTRY.auth.me) || cleanUrl.endsWith(ENDPOINT_REGISTRY.users.profile)) {
      return buildEnvelope(MOCK_USER);
    }

    if (cleanUrl.includes(ENDPOINT_REGISTRY.projects.base)) {
      const match = url.match(/\/projects\/([^/]+)/);
      if (match) {
        const id = match[1];
        const project = MOCK_PROJECTS.find((p) => p.id === id);
        if (!project) {
          throw {
            status: 404,
            statusText: 'Not Found',
            data: { error: { message: `Project with ID ${id} was not found.`, traceId } }
          };
        }
        return buildEnvelope(project);
      }
      return {
        data: MOCK_PROJECTS,
        meta: { timestamp, traceId, correlationId },
        pagination: {
          page: 1,
          limit: 10,
          totalCount: MOCK_PROJECTS.length,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false
        }
      };
    }

    if (cleanUrl.endsWith(ENDPOINT_REGISTRY.dashboard.metrics)) {
      return buildEnvelope(MOCK_DASHBOARD_METRICS);
    }

    if (cleanUrl.endsWith(ENDPOINT_REGISTRY.ai.transcribe)) {
      return buildEnvelope(MOCK_AI_TRANSCRIPTION);
    }

    throw {
      status: 404,
      statusText: 'Not Found',
      data: { error: { message: 'Mock route match unhandled.', traceId } }
    };
  }
}