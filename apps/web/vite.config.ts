import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "src/app"),
      "@experience": path.resolve(__dirname, "src/experience"),
      "@scenes": path.resolve(__dirname, "src/scenes"),
      "@services": path.resolve(__dirname, "src/services"),
      "@motion": path.resolve(__dirname, "src/motion"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@styles": path.resolve(__dirname, "src/styles")
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? "0.0.0")
  },
  server: {
    port: 5173,
    host: "0.0.0.0"
  },
  preview: {
    port: 4173,
    host: "0.0.0.0"
  }
});
