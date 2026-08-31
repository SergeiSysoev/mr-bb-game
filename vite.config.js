import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/mr-bb-game/' : '/',
  build: {
    target: 'es2022',
  },
});
