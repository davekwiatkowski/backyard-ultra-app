import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'Backyard Ultra App',
        short_name: 'BYU App',
        description: 'An app for backyard ultras',
        theme_color: '#91a0b8',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  assetsInclude: ['**/*.m4a'],
});
