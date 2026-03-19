import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import treenityPlugin from './vite-plugin-mods';
import { treenityServer } from './vite-plugin-treenity';

export default defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  plugins: [
    treenityServer(),
    treenityPlugin({ modsDirs: [resolve(import.meta.dirname, 'mods'), resolve(import.meta.dirname, 'engine/mods')] }),
    tailwindcss(),
    react({ babel: { plugins: ['babel-plugin-react-compiler'] } }),
  ],
  optimizeDeps: {
    exclude: ['@treenity/core', '@treenity/mods'],
    include: [
      'use-sync-external-store/shim',
      'use-sync-external-store/shim/with-selector',
      'react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'react/jsx-dev-runtime',
      'immer', 'valtio', 'dayjs', 'sift',
      '@tanstack/react-query',
      '@trpc/client',
    ],
  },
  server: {
    port: 3210,
    host: '0.0.0.0',
    proxy: {
      '/trpc/': { target: 'http://127.0.0.1:3211', changeOrigin: true },
      '/api/': { target: 'http://127.0.0.1:3211', changeOrigin: true },
    },
  },
})
