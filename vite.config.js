import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Uses the GITHUB_REPOSITORY env var (e.g. "username/my-repo") to extract
  // the repo name at build time. Falls back to '/' for local dev.
  base: process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/',
  build: {
    chunkSizeWarningLimit: 3000,
  }
});
