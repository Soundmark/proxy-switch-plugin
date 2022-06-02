const webpack = require("webpack");
const Server = require("webpack-dev-server");

describe("webpack", () => {
  // test("server config", async () => {
  //   const webpackConfig = require("./webpack.config");
  //   const compiler = webpack(webpackConfig);
  //   const server = new Server({}, compiler);
  //   await server.start();
  //   console.log(server.options.proxy);
  //   expect(1 + 2);
  //   await server.stop();
  // });
  test("aa", () => {
    expect(3 + 2).toBe(5);
  });
});
