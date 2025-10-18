import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

function compatPlugin(plugin: unknown): PluginOption {
  return plugin as PluginOption;
}

export default defineConfig({
  plugins: [compatPlugin(react()), compatPlugin(tsconfigPaths())],
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
