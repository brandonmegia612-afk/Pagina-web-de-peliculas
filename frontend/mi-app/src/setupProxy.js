const { createProxyMiddleware } = require('http-proxy-middleware');

const proxyTarget = process.env.PROXY_TARGET || 'http://localhost:3001';

module.exports = function(app) {
  // Proxy only API requests to the backend
  app.use(
    createProxyMiddleware('/api', {
      target: proxyTarget,
      changeOrigin: true,
      secure: false,
    })
  );
};
