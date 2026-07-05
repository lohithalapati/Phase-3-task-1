# Environment Variables

## Backend

DATABASE_URL=postgresql://user:password@localhost:5432/neuralhandoff
REDIS_URL=redis://localhost:6379

JWT_SECRET=super_secret_key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

OPENAI_API_KEY=
OLLAMA_BASE_URL=http://localhost:11434

S3_ENDPOINT=
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_BUCKET=

---

## Frontend

VITE_API_BASE_URL=http://localhost:8000/api/v1