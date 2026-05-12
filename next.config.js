/** @type {import('next').NextConfig} */
const nextConfig = {
  // Redirect home page to winwinlanding
  async redirects() {
    return [
      {
        source: '/',
        destination: '/winwinlanding/index.html',
        permanent: false, // Use 307 temporary redirect
      },
    ]
  },

  // Disable automatic trailing slash redirect
  trailingSlash: false,
}

module.exports = nextConfig
