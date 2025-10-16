import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "bm-ui",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});
