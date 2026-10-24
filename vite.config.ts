import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serve questo repo da un sotto-percorso: https://<utente>.github.io/chess-trainer/
  base: '/chess-trainer/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      workbox: {
        // il motore Stockfish (lite-single, ~1.8MB) deve entrare nella precache per funzionare offline
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        // aggiunge .json alla precache di default (serve per public/puzzles.json, i puzzle tattici),
        // mantenendo .wasm (il motore Stockfish) che altrimenti verrebbe escluso dai pattern di default
        globPatterns: ["**/*.{js,css,html,svg,json,wasm}"],
      },
      manifest: {
        name: 'Chess Trainer',
        short_name: 'Chess Trainer',
        description: 'Impara ad aprire le partite a scacchi con corsi guidati e un avversario adattivo.',
        theme_color: '#171a21',
        background_color: '#0f1115',
        display: 'standalone',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
})
