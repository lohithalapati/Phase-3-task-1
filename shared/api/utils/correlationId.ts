export function generateCorrelationId(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return 'corr-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now().toString(36);
}
