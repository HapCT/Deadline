import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    // Cho cài ra màn hình chính điện thoại và mở được khi mất mạng.
    // Có bản mới thì service worker tự cập nhật ở lần mở sau.
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      // Font Poppins tải từ Google: lưu lại sau lần đầu để mất mạng vẫn đúng font.
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      manifest: {
        name: 'Deadline Radar',
        short_name: 'Deadline',
        description: 'Luôn thấy deadline gấp nhất và còn bao lâu.',
        lang: 'vi',
        start_url: '/',
        display: 'standalone',
        background_color: '#FFFFFF',
        theme_color: '#85661F',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
});
