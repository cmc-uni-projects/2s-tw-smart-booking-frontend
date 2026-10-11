# Stage 1: build the static bundle (Vite inlines VITE_* vars at build time)
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# The code reads two different names for the API URL (axios uses VITE_REACT_APP_API_URL,
# image helpers use VITE_API_BASE_URL), so set both.
ARG VITE_API_URL=http://localhost:8386/api/v1
ARG VITE_MAPBOX_TOKEN=
ENV VITE_REACT_APP_API_URL=$VITE_API_URL \
    VITE_API_BASE_URL=$VITE_API_URL \
    VITE_MAPBOX_TOKEN=$VITE_MAPBOX_TOKEN
RUN npm run build

# Stage 2: serve with nginx, falling back to index.html for client-side routes
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
