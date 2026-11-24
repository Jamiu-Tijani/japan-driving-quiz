import { defineConfig } from 'vite';
export default defineConfig({
  base: '/japan-driving-quiz/',
  build: { target: 'es2022', outDir: 'dist' }
});
