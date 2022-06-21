const webpack = require("webpack");
const Server = require("webpack-dev-server");
const Config = require("webpack-chain");
const fetch = require("isomorphic-fetch");
const fs = require("fs");
const path = require("path");

const webpackConfig = require("./webpack.config");
const config = new Config();
webpackConfig.chainWebpack(config);
const compiler = webpack(config.toConfig());
const server = new Server({ port: 4243 }, compiler);

beforeAll(async () => {
  await server.start();
});

afterAll(async () => {
  await server.stop();
  const fileData = fs.readFileSync(
    path.join(__dirname, "webpack.config.js"),
    "utf-8"
  );
  const newFileData = fileData.replace("merry", "peter");
  fs.writeFileSync(path.join(__dirname, "webpack.config.js"), newFileData);
});

describe("webpack chain", () => {
  test("fetch list", async () => {
    const proxyData = await fetch("http://localhost:4243/proxy/list").then(
      (res) => res.json()
    );
    expect(proxyData.list.length).toBe(2);
    expect(proxyData.defaultProxy).toBe("park");
  });

  test("watch file", async () => {
    jest.resetModules();
    const fileData = fs.readFileSync(
      path.join(__dirname, "webpack.config.js"),
      "utf-8"
    );
    const newFileData = fileData.replace("peter", "merry");
    fs.writeFileSync(path.join(__dirname, "webpack.config.js"), newFileData);
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve();
      }, 5000)
    );
    const proxyData = await fetch("http://localhost:4243/proxy/list").then(
      (res) => res.json()
    );
    expect(proxyData.list).toContain("merry");
  }, 8000);
});
