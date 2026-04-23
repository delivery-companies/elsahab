// @ts-nocheck
// import MillionLint from '@million/lint';
// import million from 'million/compiler';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
const _plugins = [react()];
// _plugins.unshift(million.vite({
//   auto: true
// }), MillionLint.vite())
export default defineConfig({
  plugins: _plugins,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
