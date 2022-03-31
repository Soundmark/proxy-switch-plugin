const proxyFactory = (proxyConfig = {}) => {
  const proxyRules = Object.entries(proxyConfig);
  const proxy = proxyRules.map(([match, options]) => {
    return {
      changeOrigin: true,
      onProxyRes: (proxyRes, req) => {
        const rewriteRules = Object.entries(options.pathRewrite || {});
        let url = req.url;
        for (let i = 0; i < rewriteRules.length; i++) {
          const [matchPath, rewritePath] = rewriteRules[i];
          const reg = new RegExp(matchPath);
          if (url.match(reg).length) {
            url = url.replace(reg, rewritePath);
            break;
          }
        }
        proxyRes.headers["x-real-url"] =
          options.target.replace(/\/$/, "") + url;
      },
      ...options,
      context: match,
    };
  });
  return proxy;
};

module.exports = { proxyFactory };
