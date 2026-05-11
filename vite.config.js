import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Separar Firebase en chunks independientes para mejor caching.
    // Cuando actualizas tu código de app, los usuarios NO re-descargan Firebase.
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Firebase Auth + App core - se cachea independientemente
          if (id.includes('firebase/app') || id.includes('firebase/auth') || id.includes('@firebase/app') || id.includes('@firebase/auth')) {
            return 'firebase-core';
          }
          // Firestore - solo se carga tras autenticación
          if (id.includes('firebase/firestore') || id.includes('@firebase/firestore')) {
            return 'firebase-firestore';
          }
        }
      }
    }
  }
});
