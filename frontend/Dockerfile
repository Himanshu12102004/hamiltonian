# Use the official nginx image as the base image
FROM nginx:alpine

# Copy the dist folder to the nginx html directory
COPY dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
