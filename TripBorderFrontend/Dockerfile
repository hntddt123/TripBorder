# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=25.6.0

# Use production node environment by default.
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Make sure latest npm is 
RUN npm install -g npm

# Install dependencies
RUN npm i

# Copy the rest of the application code
COPY . .
RUN npm run build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Run the nginx.
CMD ["nginx", "-g", "daemon off;"]
