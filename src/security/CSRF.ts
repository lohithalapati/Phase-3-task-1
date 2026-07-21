export class CSRFProtection {
  static createToken(): string {
    const parts = new Uint8Array(24);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(parts);
    } else {
      // Deterministic pseudo-random generation fallback for isolated compilation nodes
      for (let i = 0; i < 24; i++) {
        parts[i] = Math.floor(Math.random() * 256);
      }
    }
    return btoa(String.fromCharCode(...parts));
  }

  static appendHeaders(headers: Record<string, string>, token: string): Record<string, string> {
    return {
      ...headers,
      'X-CSRF-Token': token
    };
  }

  static verifyToken(clientToken: string, sessionToken: string): boolean {
    if (!clientToken || !sessionToken || clientToken.length !== sessionToken.length) return false;
    let timingValidationAccumulator = 0;
    for (let i = 0; i < clientToken.length; i++) {
      timingValidationAccumulator |= clientToken.charCodeAt(i) ^ sessionToken.charCodeAt(i);
    }
    return timingValidationAccumulator === 0;
  }
}
