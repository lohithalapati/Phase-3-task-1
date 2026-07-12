# NeuralHandoff V5 — Architectural UML Lifecycle Diagrams

The core API engine operates on highly optimized, asynchronous interceptor chains.

## 1. Request/Response Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor UI as Component UI Mount
    participant Hook as useQuery Hook
    participant Http as HttpClient Singleton
    participant Axios as Axios Singleton
    participant Interceptors as Axios Interceptors
    participant Gateway as Remote API Gateway

    UI->>Hook: useQuery("/projects")
    Hook->>Http: get("/projects", config)
    Http->>Axios: get("/projects", config)
    Axios->>Interceptors: request.use() (Inject headers, Trace IDs, auth token)
    Interceptors->>Gateway: Dispatched HTTP GET (Signed, Tracked)
    Gateway-->>Interceptors: Standard Response Payload
    Interceptors->>Axios: response.use() (Check Status, Track latency metrics)
    Axios-->>Http: Return data envelope
    Http-->>Hook: Return data envelope
    Hook-->>UI: Update reactive state (loading: false, data)sequenceDiagram
    autonumber
    participant App as Active Outbound Requests
    participant Interceptor as Axios Response Interceptor
    participant Queue as Silent Replay Queue
    participant Gateway as Security Gate (401 Handler)

    App->>Interceptor: Request Dispatched
    Interceptor->>Gateway: Dispatch Payload
    Gateway-->>Interceptor: 401 Unauthorized (Expired Lease)
    alt isRefreshing is FALSE
        Interceptor->>Interceptor: Set isRefreshing = TRUE
        Interceptor->>Gateway: POST /auth/refresh-token
        Gateway-->>Interceptor: 200 OK (New Tokens Issued)
        Interceptor->>Interceptor: Update LocalStorage & common auth header
        Interceptor->>App: Replay original request (Success)
        Interceptor->>Queue: Drain & replay queued requests with fresh tokens
        Interceptor->>Interceptor: Set isRefreshing = FALSE
    else isRefreshing is TRUE
        Interceptor->>Queue: Push request Promise to failedQueue array
        Queue-->>App: Wait for refresh resolve trigger
    end
sequenceDiagram
    autonumber
    actor User as Component Action Spammer
    participant Client as HttpClient
    participant Interceptor as Axios Request Interceptor
    participant Active as Active Request Registry Map

    User->>Client: Click Trigger (Request #1)
    Client->>Interceptor: Outbound Request (Signature: method:url:body)
    Interceptor->>Active: Signature key exists? No. Register request controller.
    Interceptor->>User: Request #1 Pending...

    User->>Client: Click Spammed Trigger (Request #2)
    Client->>Interceptor: Outbound Request (Identical Signature)
    Interceptor->>Active: Signature key exists? YES.
    Interceptor->>Active: Extract & Call Request #1 Controller.abort()
    Active-->>User: Request #1 Aborted (CanceledError)
    Interceptor->>Active: Register Request #2 controller.
    Interceptor->>User: Request #2 Pending...