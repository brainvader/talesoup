import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const isTauri = process.env.TAURI_ENV_PLATFORM !== undefined

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Tauri用: 静的ポートを固定しホスト解決を有効化
  server: {
    port: 5173,
    strictPort: true,
    host: isTauri ? '0.0.0.0' : 'localhost',
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  // Tauri本番ビルド用
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    // Tauri環境ではesbuildを使用（Chromium内蔵のため）
    target: isTauri ? ['es2021', 'chrome105'] : 'modules',
    minify: isTauri ? 'esbuild' : 'esbuild',
    sourcemap: !isTauri,
  },
})
