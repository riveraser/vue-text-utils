import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "VueTextUtils",
      fileName: (format: string) => `index.${format}.js`,
    },
    rollupOptions: {
      // External dependencies that should not be bundled
      external: ["vue"],
      output: {
        // Global variables to use for external dependencies
        globals: {
          vue: "Vue",
        },
        // Use named exports only
        exports: "named",
      },
    },
    target: "es2015",
    sourcemap: true,
    minify: "terser",
  },

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  test: {
    globals: true,
    environment: "jsdom",
  },
});
