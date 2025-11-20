# Stage 1: Build the React app
FROM node:20 AS build  

WORKDIR /app

# Copy package.json and lockfile
COPY package*.json ./  

# Install dependencies
RUN npm install  

# Copy the rest of the app
COPY . .  

# Build-time env for Vite
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build React app
RUN npm run build  

# Stage 2: Serve with Nginx
FROM nginx:alpine  

# Copy built files to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80  

CMD ["nginx", "-g", "daemon off;"]
