# Use the official Node.js LTS image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that the Node.js application listens on
EXPOSE 3000

# Set environment variable to enable nodemon in development
ENV NODE_ENV=dev

# Start the Node.js application
CMD ["npm", "start", "dev"]
