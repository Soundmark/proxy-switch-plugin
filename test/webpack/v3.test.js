const webpack = require("webpack");
const Server = require("webpack-dev-server-v3");
const fetch = require("isomorphic-fetch");
const chalk = require("chalk");

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
});
