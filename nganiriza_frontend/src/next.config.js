const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    // Example: cache pages & static assets
    {
      urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
      handler: 'CacheFirst',
      options: { cacheName: 'google-fonts' }
    },
    {
      urlPattern: ({request}) => request.destination === 'image',
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'images', expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 } }
    },
    {
      urlPattern: ({request}) => request.destination === 'script' || request.destination === 'style',
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'static-resources' }
    }
  ]
});

module.exports = withPWA({
  reactStrictMode: true
});
