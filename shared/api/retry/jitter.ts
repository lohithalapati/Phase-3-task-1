export function getJitterDelay(attempt: number, baseDelayMs: number, maxDelayMs: number): number {
  const exponentialDelay = baseDelayMs * Math.pow(2, attempt);
  const boundedDelay = Math.min(exponentialDelay, maxDelayMs);
  return Math.floor(Math.random() * boundedDelay);
}
