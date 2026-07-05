# NeuralHandoff — System Architecture

## 1. High-Level Overview

NeuralHandoff is a multi-tenant Enterprise Knowledge Intelligence Platform.

Architecture Flow:

Frontend (React + Vite)
        ↓
Backend API (FastAPI)
        ↓
PostgreSQL (Primary Database + pgvector)
        ↓
Redis (Caching + Background Jobs)
        ↓
Object Storage (S3-compatible)

---

## 2. Architectural Principles

- Multi-tenant by design
- Clear separation of concerns
- Service-layer driven backend
- Environment-based configuration
- AI provider abstraction layer
- Scalable and container-ready

---

## 3. Backend Layers

### API Layer
- Route definitions
- Request validation
- Response formatting

### Service Layer
- Business logic
- Permission enforcement
- Orchestration

### Data Layer
- SQLAlchemy models
- Repository access
- Database session management

---

## 4. Multi-Tenant Enforcement

Every tenant-scoped entity includes:

organization_id (indexed)

Tenant isolation enforced at:
- Query level
- Service layer
- Permission layer

---

## 5. Future AI Layer

AI Provider abstraction:

- OpenAI Provider
- Ollama Provider
- Future LLM integrations

Switchable via environment variable.