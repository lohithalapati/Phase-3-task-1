const SENSITIVE_KEYS = ['password', 'token', 'accessToken', 'refreshToken', 'secret', 'client_secret', 'authorization', 'cookie', 'cardNumber', 'cvv'];

export function sanitizePayload<T>(payload: T): T {
  if (!payload || typeof payload !== 'object') return payload;

  try {
    const deepCopy = JSON.parse(JSON.stringify(payload));
    const sanitize = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;
      for (const key of Object.keys(obj)) {
        if (SENSITIVE_KEYS.includes(key.toLowerCase())) {
          obj[key] = '[REDACTED]';
        } else if (typeof obj[key] === 'object') {
          sanitize(obj[key]);
        }
      }
    };
    sanitize(deepCopy);
    return deepCopy;
  } catch {
    return payload;
  }
}
