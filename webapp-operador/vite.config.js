// vite.config.js
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    proxy: {
      // Proxy directo a las rutas de FastAPI
      '/rutas':      { target: 'http://localhost:8000', changeOrigin: true },
      '/mensajeros': { target: 'http://localhost:8000', changeOrigin: true },
      '/envios':     { target: 'http://localhost:8000', changeOrigin: true },
      '/paquetes':   { target: 'http://localhost:8000', changeOrigin: true },
      '/entregas':   { target: 'http://localhost:8000', changeOrigin: true }, 
      // agrega los demás routers igual...
    }
  }
})
