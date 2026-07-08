import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    })
  ],
  build: {
    // Separar dependencias pesadas en chunks independientes para mejor caching
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Firebase Auth + App core
          if (id.includes('firebase/app') || id.includes('firebase/auth') || id.includes('@firebase/app') || id.includes('@firebase/auth')) {
            return 'firebase-core';
          }
          // Firestore
          if (id.includes('firebase/firestore') || id.includes('@firebase/firestore')) {
            return 'firebase-firestore';
          }
          // Generador de PDF (súper pesado)
          if (id.includes('html2pdf.js') || id.includes('jspdf') || id.includes('html2canvas')) {
            return 'html2pdf';
          }
        }
      }
    }
  }
});
