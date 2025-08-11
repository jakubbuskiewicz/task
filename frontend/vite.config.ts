import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: ".", // Set root
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    open: true, // Automatically open browser
  },
  build: {
    outDir: "./dist", // Output to dist directory in project root
  },
});
