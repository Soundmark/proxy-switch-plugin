const clearModule = require("clear-module");

const proxyFactory = (proxyConfig = {}) => {
  const proxyRules = Object.entries(proxyConfig);
  const proxy = proxyRules.map(([match, options]) => {
    return {
      changeOrigin: true,
      onProxyRes: (proxyRes, req) => {
        proxyRes.headers["x-real-url"] =
          options.target.replace(/\/$/, "") + req.url;
      },
      ...options,
      context: match,
    };
  });
  return proxy;
};

const updateConfig = function () {
  clearModule(this.pluginOption.watchPath);
  let config = require(this.pluginOption.watchPath);
  let target;
  if (typeof config.chainWebpack === "function") {
    // chainWebpack
    const Chain = require("webpack-chain");
    const chain = new Chain();
    config.chainWebpack(chain);
    const plugins = Object.fromEntries(chain.plugins.store.entries());
    const ProxySwitchPlugin = Object.values(plugins).find((item) => {
      const params = Object.fromEntries(item.store.entries());
      return params.plugin.name === "proxy-switch-plugin";
    });
    target = {
      option: Object.fromEntries(ProxySwitchPlugin.store.entries()).args[0],
    };
  } else {
    // webpack
    if (typeof config === "function") {
      config = config("development");
    }
    const plugins = config.plugins;
    if (plugins && plugins.length) {
      target = plugins.find((item) => item.name === "proxy-switch-plugin");
    }
  }

  if (target) {
    if (
      JSON.stringify(this.pluginOption.proxyList) ===
      JSON.stringify(target.option.proxyList)
    )
      return false;
    this.pluginOption.proxyList = target.option.proxyList;
    this.proxyKeys = Object.keys(this.pluginOption.proxyList || {});
    this.options.proxy = proxyFactory(
      this.pluginOption.proxyList[
        this.pluginOption.defaultProxy || this.proxyKeys[0]
      ]
    );
    return true;
  }

  return false;
};

module.exports = { proxyFactory, updateConfig };
