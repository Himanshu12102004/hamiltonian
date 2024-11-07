# NGINX - Engine X - README

## What this README contains?

- [What is NGINX?](#what-is-nginx)
- [What We will use NGINX for?](#what-we-will-use-nginx-for)
- [Configuration](#configuration)

## What is NGINX?

NGINX is a web server that can also be used as a reverse proxy, load balancer, mail proxy, and HTTP cache. The software was created by Igor Sysoev and first publicly released in 2004. A company of the same name was founded in 2011 to provide support and Nginx plus paid software.

### What We will use NGINX for?

1. We will use NGINX as a reverse proxy to serve our react build application with docker container.
2. NGINX will increase the security of our application by hiding the actual server and serving the application on port 80, All the fetch requests will be made passed through our NGINX server as the backend will be hidden in a container connected to our frontend only via a network bridge.

### Configuration

We will use the following configuration for our NGINX server:

- Website will be served as awardsConvocation.com for that we will use the following configuration:

```nginx
server {
    listen 80;
    server_name awardsConvocation.com;

    error_log /var/log/nginx/error.log;
    access_log /var/log/nginx/access.log;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    location /api/v1 {
        proxy_pass http://backend:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```
