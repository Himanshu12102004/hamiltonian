import { defineConfig } from "vite";
import dotenv from "dotenv";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";

dotenv.config({
  path: "config.env",
});
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    glsl({
      include: [
        "**/*.glsl",
        "**/*.vs",
        "**/*.fs",
        "**/*.vert",
        "**/*.frag",
        "**/*.vs.glsl",
        "**/*.fs.glsl",
      ],
    }),
  ],
  define: {
    "process.env": process.env,
  },
  server: {
    host: true, // This will allow the server to be accessed externally
    port: 5173, // You can specify the port you want to use
  },
});
