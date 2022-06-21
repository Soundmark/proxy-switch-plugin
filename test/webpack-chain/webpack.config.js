const HTMLGeneratorPlugin = require("../public/html-generator-plugin");
const ProxySwitchPlugin = require("../../src/index");
const path = require("path");

module.exports = {
  chainWebpack: (config) => {
    config.mode("development");
    config
      .entry("foo")
      .add(path.join(__dirname, "../public/foo.js"))
      .end()
      .output.path("/");
    config.plugin("html").use(HTMLGeneratorPlugin);
    config.plugin("proxy-switch-plugin").use(ProxySwitchPlugin, [
      {
        proxyList: {
          peter: {
            "/api": {
              target: "http://localhost:3000",
            },
          },
          park: {
            "/api": {
              target: "http://localhost:3002",
            },
          },
        },
        defaultProxy: "park",
        watchPath: path.join(__dirname, "webpack.config.js"),
      },
    ]);
  },
};
