# Response Processing Pipeline

Incoming responses follow a strict classification sequence:
[Server Response]
¦
+--? SUCCESS (2xx) --? Log Latency --? Return Raw Data
¦
+--? ERROR (4xx/5xx)
¦
+--? 401 Unauthorized --? [Token Refresh Pipeline]
¦
+--? Idempotent? -------? [Resilient Retry Engine]
¦
+--? Fallback ----------? Normalise to ApiError
