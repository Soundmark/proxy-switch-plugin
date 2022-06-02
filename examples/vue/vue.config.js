const { defineConfig } = require("@vue/cli-service");
const ProxySwitchPlugin = require("../../src/ProxySwitchPlugin");
const Server = require("webpack-dev-server");

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.plugin("proxy-switch-plugin").use(ProxySwitchPlugin, [
      {
        // 将你所有的proxy配置写进来
        proxyList: {
          小明: {
            "/api": {
              target: "http://localhost:3000",
              pathRewrite: {
                "/api": "/",
              },
            },
          },
          小红: {
            "/api": {
              target: "http://localhost:3001",
              pathRewrite: {
                "/api": "/",
              },
            },
          },
        },
        // 默认的proxy配置的key
        defaultProxy: "小红",
      },
      Server,
    ]);
  },
});
