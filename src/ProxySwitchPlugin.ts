class ProxySwitchPlugin {
  option: any;
  baseRouteStackLength: number;

  constructor(option) {
    this.option = option;
  }

  apply(compiler: any) {
    compiler.options.devServer.setupMiddlewares = (middlewares, devServer) => {
      devServer.app.get("/proxy/list", (req, res) => {
        res.status(200).json({
          list: [{ label: "peter", value: "peter" }],
        });
      });
      devServer.app.get("/proxy/change", (req, res) => {
        console.log(devServer.app._router.stack);
        res.status(200);
      });
      console.log(devServer.app._router.stack);
      this.baseRouteStackLength = devServer.app._router.stack.length;
      return middlewares;
    };
  }
}

export default ProxySwitchPlugin;
