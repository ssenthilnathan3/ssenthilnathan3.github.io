import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import contentCollections from "@content-collections/vite";

export default defineConfig({
  plugins: [react(), contentCollections()],
  define: {
    'process.env': process.env,
  },
});
