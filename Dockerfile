# Stage 1: Build Environment
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: High-Performance Production Delivery
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY vercel.json /usr/share/nginx/html/vercel.json
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]