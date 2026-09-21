import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { portfolioDataPlugin } from '../portfolioDataServerPlugin.mjs';

export default defineConfig({
  plugins: [react(), portfolioDataPlugin()],
  server: {
    port: 5174,
    host: true,
  },
});
