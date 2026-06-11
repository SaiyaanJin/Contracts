import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3004,
    open: false,
    host: true,
  },
  define: {
    'process.env': {
      REACT_APP_API_URL: 'http://localhost:5011',
      REACT_APP_SSO_URL: 'https://sso.erldc.in:3000',
    }
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});
