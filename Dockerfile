# Use Node.js image
FROM node:latest

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Set TypeScript compilation
RUN npm run build

# Start the server
CMD ["npm", "run", "dev"]
