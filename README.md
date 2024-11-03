# Graph Algorithms

## Branch Structure and Usage

This project has two main branches: `main` and `deployment`.

1. **main branch**: For local development. Use this branch to run the project on your local machine.
2. **deployment branch**: For deployment to the web. This branch contains production-ready code and deployment configurations.

## Getting Started

This branch is intended for deploying the application to a production server. Follow these steps to set up and deploy the project.

### Prerequisites

- **Node.js** and **npm** installed (Ensure you are using the latest stable versions)
- **Hosting Provider Account** (e.g., AWS, Heroku, Vercel, DigitalOcean, or other)
- **Environment Variables**: Set up the required environment variables in your hosting provider’s dashboard.

---

## Project Structure

```plaintext
- backend/
  - server.js
  - other backend files

- frontend/
  - index.html
  - other frontend files
```

## Deployment Instructions

### Backend

1. **Install dependencies**
   Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

2. **Set Environment Variables**
   Set the required environment variables in your hosting provider’s dashboard.
   Configure the following environment variables in your server's environment or in a .env file (if supported):

   - PORT: The port on which the backend will run (e.g., 5000)
   - Other variables required by your backend setup, such as DATABASE_URL, API_KEY, etc.

3. **Start the Server**
   Use the following command to start the backend server in production mode:

```bash
npm start
```

4. **Deploy to Hosting Provider**
   Deploy the backend to your hosting provider.

### Frontend

1. **Install dependencies**
   Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

2. Build for Production
   Build the frontend for production using the following command:

```bash
npm run build
```

3. Deploy to Hosting Provider
   Deploy the frontend to your hosting provider.

---

> This markdown code should be used for the `README.md` in your `deployment` branch and provides detailed setup and deployment instructions. Modify the content as needed to suit your project requirements.
