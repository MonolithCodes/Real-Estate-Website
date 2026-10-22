import { existsSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Home 3D story: use the designer model when present, otherwise the procedural house (src/three/house/README.md).
    __HOUSE_GLB__: JSON.stringify(existsSync('public/models/house.glb')),
  },
})
