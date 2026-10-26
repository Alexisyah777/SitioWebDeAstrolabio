import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const COLOR_FONDO = '#0b151e' // --bg en src/index.css
const DIA = 24 * 60 * 60

// En local, /api/* se reenvía a la API, igual que el rewrite de vercel.json en producción.
// Para usar la API local: API_URL=http://localhost:3000 npm run dev
const proxyApi = {
  '/api': { target: process.env.API_URL || 'https://astrolabio-api.vercel.app', changeOrigin: true },
}

// Vite config — https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), pwa()],
  server: { port: 8443, proxy: proxyApi },
  preview: { port: 8443, proxy: proxyApi },
})

/**
 * PWA: manifest para instalarla y un service worker que guarda el sitio, las
 * respuestas de la API y las imágenes para mostrarlos sin conexión.
 * Los íconos se generan con `node scripts/generar-iconos.mjs`.
 */
function pwa() {
  return VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
    manifest: {
      name: 'ASTROLABIO',
      short_name: 'ASTROLABIO',
      // Igual que la meta "description" de index.html.
      description:
        'Explora la historia, el mundo, los personajes y las mecánicas de ASTROLABIO, un juego de plataformas 2D en pixel art, y descubre su tráiler.',
      lang: 'es',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: COLOR_FONDO,
      theme_color: COLOR_FONDO,
      icons: [
        { src: '/icono-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icono-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icono-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      // /api/* lo atiende la API (rewrite de vercel.json), nunca el index.html guardado.
      navigateFallbackDenylist: [/^\/api\//],
      runtimeCaching: [
        {
          // Primero la red; si tarda o falla (sin conexión, arranque en frío, Supabase
          // pausado), la última respuesta guardada. Es el equivalente a Room en Android.
          urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith('/api/v1/'),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'astrolabio-api',
            networkTimeoutSeconds: 8,
            expiration: { maxEntries: 100, maxAgeSeconds: 30 * DIA },
            cacheableResponse: { statuses: [200] },
            plugins: [
              {
                // Un 500 de la API también usa lo guardado en vez de mostrar el error.
                fetchDidSucceed: async ({ response }) => {
                  if (response.status >= 500) throw new Error(`La API respondió ${response.status}`)
                  return response
                },
              },
            ],
          },
        },
        {
          // Imágenes públicas de Supabase Storage: no cambian de URL, se guardan al verlas.
          urlPattern: ({ url }) => url.hostname.endsWith('.supabase.co') && url.pathname.startsWith('/storage/v1/object/public/'),
          handler: 'CacheFirst',
          options: {
            cacheName: 'astrolabio-imagenes',
            expiration: { maxEntries: 200, maxAgeSeconds: 30 * DIA },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com',
          handler: 'StaleWhileRevalidate',
          options: { cacheName: 'google-fonts-css' },
        },
        {
          urlPattern: ({ url }) => url.origin === 'https://fonts.gstatic.com',
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts',
            expiration: { maxEntries: 20, maxAgeSeconds: 365 * DIA },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
      ],
    },
  })
}
