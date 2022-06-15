const webpack = require("webpack");
const Server = require("webpack-dev-server-v3");
const fetch = require("isomorphic-fetch");

const webpackConfig = require("./webpack.config");
const compiler = webpack(webpackConfig);
const server = new Server(compiler, {});

beforeAll(async () => {
  server.listen(4241, "localhost");
});

afterAll(async () => {
  server.close();
});

describe("webpack dev server v3", () => {
  test("fetch list", async () => {
    const proxyData = await fetch("http://localhost:4241/proxy/list").then(
      (res) => res.json()
    );
    expect(proxyData.list.length).toBe(2);
    expect(proxyData.defaultProxy).toBe("park");
  });
});
