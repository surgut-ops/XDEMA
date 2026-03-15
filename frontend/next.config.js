/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'storage.yandexcloud.net' },
      { protocol: 'https', hostname: '*.s3.amazonaws.com' },
    ],
  },
  // Raw body for Stripe webhooks (on API routes)
  api: { bodyParser: false },
};

module.exports = nextConfig;
