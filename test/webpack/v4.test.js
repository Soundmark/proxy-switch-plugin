const webpack = require("webpack");
const Server = require("webpack-dev-server");
const fetch = require("isomorphic-fetch");

const webpackConfig = require("./webpack.config");
const compiler = webpack(webpackConfig);
const server = new Server({ port: 4242 }, compiler);

beforeAll(async () => {
  await server.start();
});

afterAll(async () => {
  await server.stop();
});

describe("webpack dev server v4", () => {
  test("fetch list", async () => {
    const proxyData = await fetch("http://localhost:4242/proxy/list").then(
      (res) => res.json()
    );
    expect(proxyData.list.length).toBe(2);
    expect(proxyData.defaultProxy).toBe("park");
  });
});
