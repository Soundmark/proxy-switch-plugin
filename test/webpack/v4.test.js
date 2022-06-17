const webpack = require("webpack");
const Server = require("webpack-dev-server");
const fetch = require("isomorphic-fetch");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

const webpackConfig = require("./webpack.config");
const compiler = webpack(webpackConfig);
const server = new Server({ port: 4242 }, compiler);

let originalLog = global.console.log;

beforeAll(async () => {
  global.console.log = jest.fn();
  await server.start();
});

afterAll(async () => {
  await server.stop();
  global.console.log = originalLog;
  const fileData = fs.readFileSync(
    path.join(__dirname, "webpack.config.js"),
    "utf-8"
  );
  const newFileData = fileData.replace("merry", "peter");
  fs.writeFileSync(path.join(__dirname, "webpack.config.js"), newFileData);
});

describe("webpack dev server v4", () => {
  test("fetch list", async () => {
    const proxyData = await fetch("http://localhost:4242/proxy/list").then(
      (res) => res.json()
    );
    expect(proxyData.list.length).toBe(2);
    expect(proxyData.defaultProxy).toBe("park");
  });

  test("change proxy", async () => {
    expect(server.options.proxy[0].target).toBe("http://localhost:3002");
    await fetch("http://localhost:4242/proxy/change?proxy=peter");
    expect(server.options.proxy[0].target).toBe("http://localhost:3000");
    expect(console.log).toBeCalledWith(
      chalk.green(`ProxySwitchPlugin: Successfully switch proxy to 'peter'`)
    );
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
    const proxyData = await fetch("http://localhost:4242/proxy/list").then(
      (res) => res.json()
    );
    expect(console.log).toBeCalledWith(
      chalk.green(`ProxySwitchPlugin: updated!`)
    );
    expect(proxyData.list).toContain("merry");
  }, 8000);
});
