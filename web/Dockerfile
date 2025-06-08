# Stage 1: Build the application
FROM node:22-slim AS build

# Set the working directory
WORKDIR /app

# Define build-time environment variables
ARG VITE_APP_API_URL
ARG VITE_APP_API_BASE_PATH

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application
FROM nginx:alpine

# Copy built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Create custom Nginx configuration inline
RUN echo 'server {' \
    'listen 80;' \
    'location / {' \
    'root /usr/share/nginx/html;' \
    'try_files $uri $uri/ /index.html;' \
    '}' \
    'error_page 404 /index.html;' \
    '}' > /etc/nginx/conf.d/default.conf

# Expose the port that Nginx will run on
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]