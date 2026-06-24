import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    
    optimizeDeps: {
      include: ['jwt-decode'],
    },
    
    // Define global constants
    define: {
      // Vite-style environment variables
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
      'import.meta.env.VITE_APP_NAME': JSON.stringify(env.VITE_APP_NAME),
      'import.meta.env.MODE': JSON.stringify(mode)
    },
    
    server: {
      port: 3000,
      proxy: {
        // API proxy for development
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5001',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        }
      }
    },
    
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  }
})