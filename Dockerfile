# Stage 1: Build the React app
FROM node:20 AS build  

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./  

# Install dependencies
RUN npm install  

# Copy the rest of the React source code
COPY . .  

# Build the React app for production (creates /build folder)
RUN npm run build  

# Stage 2: Serve the React app with Nginx
FROM nginx:alpine  

# Copy the build folder from the previous stage to Nginx's default html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80  

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
