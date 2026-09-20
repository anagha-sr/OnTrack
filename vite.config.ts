import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { resolve } from "path";
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        "service-worker":resolve(import.meta.dirname, "src/background/service-worker.ts"),
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === "service-worker") {
            return "service-worker.js";
          }

          return "assets/[name]-[hash].js";
        },
      },
    },
  },
})
