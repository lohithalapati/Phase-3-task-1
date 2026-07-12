# Stage 1: Build Layer
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime Web Server
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/docs /usr/share/nginx/html/docs
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]