import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/app": path.resolve(__dirname, "./src/app"),
      "@bm/ui": path.resolve(__dirname, "../../packages/ui/src"),
    },
  },
});
