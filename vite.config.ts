// vite.config.ts
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "node:path";
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "sam-react-modal",
      fileName: (format) => `index.${format}.js`,
      formats: ["es"] // ✅ only ESM
    },
    rollupOptions: {
      external: ["react", "react-dom"]
    },
    sourcemap: true
  },
  plugins: [
    dts({
      entryRoot: "src",
      outDir: "dist",
      insertTypesEntry: true
    }),

    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ]
});
