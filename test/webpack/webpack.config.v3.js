"use strict";

const webpack = require("webpack");
const HTMLGeneratorPlugin = require("../public/html-generator-plugin");
const ProxySwitchPlugin = require("../../src/index");
const Server = require("webpack-dev-server-v3");
const path = require("path");

const isWebpack5 = webpack.version.startsWith("5");

module.exports = {
  mode: "development",
  context: __dirname,
  stats: "none",
  entry: "../public/foo.js",
  output: {
    path: "/",
  },
  node: false,
  infrastructureLogging: isWebpack5
    ? {
        level: "info",
        stream: {
          write: () => {},
        },
      }
    : {
        level: "info",
      },
  plugins: [
    new HTMLGeneratorPlugin(),
    new ProxySwitchPlugin(
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
        watchPath: path.join(__dirname, "webpack.config.v3.js"),
      },
      Server
    ),
  ],
};
