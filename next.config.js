// next.config.js
module.exports = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'media.themoviedb.org',
          port: '',
          pathname: '/**', // This allows any path under the specified hostname
        },
      ],
    },
  };