# Stage 1: Build the React application
FROM node:20-alpine AS build

# Declare build arguments
ARG VITE_API_BASE_URL

WORKDIR /app

# Copy pnpm lockfile and package.json
COPY pnpm-lock.yaml package.json ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application, passing the ARG as an ENV var for the build command
RUN VITE_API_BASE_URL=${VITE_API_BASE_URL} pnpm build

# Stage 2: Serve the application with Nginx
FROM nginx:1.25-alpine

# Copy the build output from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom Nginx configuration (optional, but good practice)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 