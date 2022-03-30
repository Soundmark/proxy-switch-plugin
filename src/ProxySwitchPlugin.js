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

/**
 * @typedef {Object} Option
 * @property {Array} [proxyList]
 * @property {string} [defaultProxy]
 */
class ProxySwitchPlugin {
  /** @type {Option} */
  option;
  /** @type {number} */
  baseRouteStackLength;

  /**
   * @param {Option} option
   * @param {*} DevServer
   */
  constructor(option, DevServer) {
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
    const option = this.option;
    const proxyKeys = Object.keys(option?.proxyList || {});

    // version 3
    if (typeof Server.prototype.setupFeatures === "function") {
      const setupFeatures = Server.prototype.setupFeatures;
      this.options.proxy =
        option.proxyList[option?.defaultProxy || proxyKeys[0]];

      Server.prototype.setupFeatures = function () {
        this.app.get("/proxy/list", (req, res) => {
          res.status(200).json({
            list: proxyKeys,
            defaultProxy: option.defaultProxy,
          });
        });
        this.app.get("/proxy/change", async (req, res) => {
          const { proxy } = req.query;
          this.options.proxy = option?.proxyList?.[proxy];
          this.app._router.stack = this.app._router.stack.slice(
            0,
            this.baseRouteStackLength
          );
          setupFeatures.call(this);
          res.status(200);
        });

        this.baseRouteStackLength = this.app._router.stack.length;

        setupFeatures.call(this);
      };
    } else {
      //version 4
      const setupMiddlewares = Server.prototype.setupMiddlewares;
      const normalizeOptions = Server.prototype.normalizeOptions;

      Server.prototype.normalizeOptions = async function () {
        if (proxyKeys.length) {
          this.options.proxy =
            option.proxyList[option?.defaultProxy || proxyKeys[0]];
        }
        await normalizeOptions.call(this);
      };

      Server.prototype.setupMiddlewares = function (middlewares, devServer) {
        this.app.get("/proxy/list", (req, res) => {
          res.status(200).json({
            list: proxyKeys,
            defaultProxy: option.defaultProxy,
          });
        });
        this.app.get("/proxy/change", async (req, res) => {
          const { proxy } = req.query;
          this.options.proxy = option?.proxyList?.[proxy];
          await normalizeOptions.call(this);
          this.app._router.stack = this.app._router.stack.slice(
            0,
            this.baseRouteStackLength
          );
          setupMiddlewares.call(this, middlewares, devServer);
          res.status(200);
        });

        this.baseRouteStackLength = this.app._router.stack.length;

        setupMiddlewares.call(this, middlewares, devServer);
      };
    }
  }
}

module.exports = ProxySwitchPlugin;
