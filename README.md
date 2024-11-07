# Hamiltonian Cycle Project

This project is a monorepo containing both frontend and backend applications for solving the Hamiltonian Cycle problem.

## Project Structure

- `frontend/`: Contains the frontend application built with React.
- `backend/`: Contains the backend application built with Express.

## Installation

There are several methods to start the server, depending on your needs:

1. **Automatic Setup**: This method is the easiest way to start the server. It will install all the prerequisites and start the frontend and backend applications.

2. **Manual Setup**: This method is useful if the automatic setup doesn't work. It will guide you through the process of installing the prerequisites and starting the frontend and backend applications.

### Automatic Setup

This method will directly deploy the frontend and backend applications and is ready to be hosted anywhere on the web.

```bash
cd Hamiltonian_Cycle
```

2. To install prerequisites , run:

```
npm install
```

3. To start the frontend and backend applications, run the following command:

```bash
npm run deploy
```

### Development Setup

This method is useful for local development. It will start the frontend and backend applications in development mode.

```bash
cd Hamiltonian_Cycle
```

2. To install prerequisites , run:

```bash
npm install
```

3. To start the frontend and backend applications, run the following command:

```bash
npm run dev
```

## Manual Setup (if needed)

If the automatic setup doesn't work, you can manually configure:

```bash
git config merge.ours.driver true
```

## Verification

To verify the setup:

```bash
git check-attr merge README.md
```

Should output: `README.md: merge: ours`

## Branch Structure and Usage

This project has two main branches: `main` and `deployment`.

1. **main branch**: For local development. Use this branch to run the project on your local machine.
2. **deployment branch**: For deployment to the web. This branch contains production-ready code and deployment configurations.
