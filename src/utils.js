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
          options.target.replace(/\/$/, "") + req.url;
      },
      ...options,
      context: match,
    };
  });
  return proxy;
};

const onConfigChange = function () {
  delete require.cache[require.resolve(this.pluginOption.watchPath)];
  let config = require(this.pluginOption.watchPath);
  if (typeof config === "function") {
    config = config("development");
  }
  const plugins = config.plugins;
  if (plugins && plugins.length) {
    const target = plugins.find((item) => item.name === "proxy-switch-plugin");
    if (target) {
      this.pluginOption.proxyList = target.option.proxyList;
      this.proxyKeys = Object.keys(this.pluginOption.proxyList || {});
      this.options.proxy = proxyFactory(
        this.pluginOption.proxyList[
          this.pluginOption.defaultProxy || this.proxyKeys[0]
        ]
      );
    }
  }
};

module.exports = { proxyFactory, onConfigChange };
