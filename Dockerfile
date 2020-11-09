FROM node:14.15.0-alpine3.12

# Set work dir
WORKDIR /usr/app

# Copy over package files
COPY package.json ./
COPY package-lock.json ./

# Install all deps
RUN npm install
