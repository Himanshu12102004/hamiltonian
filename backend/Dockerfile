# Use the official Node.js image as the base image
# Specify the platform to avoid compatibility warnings
FROM --platform=linux/amd64 node:21

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 5002

# Command to run the application
CMD ["node", "server.js"]
