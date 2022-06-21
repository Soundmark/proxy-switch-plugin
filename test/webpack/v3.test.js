const webpack = require("webpack");
const Server = require("webpack-dev-server-v3");
const fetch = require("isomorphic-fetch");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

const webpackConfig = require("./webpack.config.v3");
const compiler = webpack(webpackConfig);
const server = new Server(compiler, {});

let originalLog = global.console.log;

beforeAll(async () => {
  global.console.log = jest.fn();
  server.listen(4241, "localhost");
});

afterAll(async () => {
  server.close();
  global.console.log = originalLog;
  const fileData = fs.readFileSync(
    path.join(__dirname, "webpack.config.v3.js"),
    "utf-8"
  );
  const newFileData = fileData.replace("merry", "peter");
  fs.writeFileSync(path.join(__dirname, "webpack.config.v3.js"), newFileData);
});

describe("webpack dev server v3", () => {
  test("fetch list", async () => {
    const proxyData = await fetch("http://localhost:4241/proxy/list").then(
      (res) => res.json()
    );
    expect(proxyData.list.length).toBe(2);
    expect(proxyData.defaultProxy).toBe("park");
  });

  test("change proxy", async () => {
    expect(server.options.proxy[0].target).toBe("http://localhost:3002");
    await fetch("http://localhost:4241/proxy/change?proxy=peter");
    expect(server.options.proxy[0].target).toBe("http://localhost:3000");
    expect(console.log).toBeCalledWith(
      chalk.green(`ProxySwitchPlugin: Successfully switch proxy to 'peter'`)
    );
  });

  test("watch file", async () => {
    jest.resetModules();
    const fileData = fs.readFileSync(
      path.join(__dirname, "webpack.config.v3.js"),
      "utf-8"
    );
    const newFileData = fileData.replace("peter", "merry");
    fs.writeFileSync(path.join(__dirname, "webpack.config.v3.js"), newFileData);
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve();
      }, 5000)
    );
    const proxyData = await fetch("http://localhost:4241/proxy/list").then(
      (res) => res.json()
    );
    expect(console.log).toBeCalledWith(
      chalk.green(`ProxySwitchPlugin: updated!`)
    );
    expect(proxyData.list).toContain("merry");
  }, 8000);
});
