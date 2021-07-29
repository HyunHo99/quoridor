const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://143.248.194.208:5000',
      changeOrigin: true,
    })
  );
};