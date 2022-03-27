let Server;
const chalk = require("chalk");
try {
  Server = require("webpack-dev-server");
} catch (e) {
  console.log(
    chalk.yellow(
      "Warning: Cannot find module webpack-dev-server, try deliver it via parameter"
    )
  );
}

interface Option {
  proxyList: Record<string, any>;
  defaultProxy?: string;
}
class ProxySwitchPlugin {
  option: Option;
  baseRouteStackLength: number;

  constructor(option: Option, DevServer?) {
    this.option = option;
    if (!Server) {
      if (DevServer) {
        Server = DevServer;
      } else {
        throw new Error(
          chalk.red(
            'Error: Cannot find Server from parameter, try "npm i webpack-dev-server -D" to solve this problem'
          )
        );
      }
    }
  }

  apply() {
    const setupMiddlewares = Server.prototype.setupMiddlewares;
    const normalizeOptions = Server.prototype.normalizeOptions;
    const option = this.option;
    const proxyKeys = Object.keys(option.proxyList);
    Server.prototype.normalizeOptions = async function () {
      this.options.proxy =
        option.proxyList[option?.defaultProxy || proxyKeys[0]];
      await normalizeOptions.call(this);
    };
    Server.prototype.setupMiddlewares = function (middlewares, devServer) {
      console.log(this.options.proxy);
      this.app.get("/proxy/list", (req, res) => {
        res.status(200).json({
          list: proxyKeys,
          defaultProxy: option.defaultProxy,
        });
      });
      this.app.get("/proxy/change", (req, res) => {
        const { proxy } = req.query;
        console.log(proxy);
        res.status(200);
      });
      this.baseRouteStackLength = this.app._router.stack.length;
      setupMiddlewares.call(this, middlewares, devServer);
    };
  }
}

module.exports = ProxySwitchPlugin;
