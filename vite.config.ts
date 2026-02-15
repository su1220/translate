import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  server: {
    host: true,
    open: true,
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
