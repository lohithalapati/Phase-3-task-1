/**
 * Jittered exponential backoff.
 * cappedDelay = min(maxDelayMs, baseDelayMs * 2^(retryCount-1))
 * result      = floor(cappedDelay + random * cappedDelay * 0.5)
 * Range: [cappedDelay, cappedDelay * 1.5)
 */
export function getJitterDelay(retryCount: number, baseDelayMs: number, maxDelayMs: number): number {
  const exp     = baseDelayMs * Math.pow(2, retryCount - 1);
  const capped  = Math.min(maxDelayMs, exp);
  const jitter  = Math.random() * capped * 0.5;
  return Math.floor(capped + jitter);
}
