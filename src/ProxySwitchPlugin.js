/**
 * @typedef {Object} ProxyItem
 * @property {string} [target]
 * @property {string} [forward]
 * @property {Object} [agent]
 * @property {Object} [ssl]
 * @property {boolean} [ws]
 * @property {boolean} [xfwd]
 * @property {boolean} [secure]
 * @property {boolean} [toProxy]
 * @property {boolean} [prependPath]
 * @property {boolean} [ignorePath]
 * @property {string} [localAddress]
 * @property {boolean} [changeOrigin]
 * @property {boolean} [preserveHeaderKeyCase]
 * @property {string} [auth]
 * @property {Object} [headers]
 * @property {number} [timeout]
 * @property {number} [proxyTimeout]
 * @property {Object|Function} [pathRewrite]
 * @property {Object|Function} [router]
 */

/**
 * @typedef {Object.<string, Object.<string, ProxyItem>>} ProxyList
 */

/**
 * @typedef {Object} Option
 * @property {ProxyList} [proxyList]
 * @property {string} [defaultProxy]
 */

let Server;
const chalk = require("chalk");
const { proxyFactory } = require("./utils");

try {
  Server = require("webpack-dev-server");
} catch (e) {
  console.log(
    chalk.yellow(
      "ProxySwitchPlugin Warning: Cannot find module webpack-dev-server, try deliver it via parameter"
    )
  );
}

class ProxySwitchPlugin {
  /** @type {Option} */
  option;
  /** @type {number} */
  baseRouteStackLength;

  /**
   * @param {Option} option
   * @param {*} [DevServer]
   */
  constructor(option, DevServer) {
    if (!option) {
      throw new Error(
        chalk.red(
          "ProxySwitchPlugin Error: It seems that you forget to deliver the option parameter, please deliver it and try again"
        )
      );
    }
    if (typeof option !== "object") {
      throw new Error(
        chalk.red(
          "ProxySwitchPlugin Error: The option parameter should be an object, see https://github.com/Soundmark/proxy-switch-plugin#readme"
        )
      );
    }
    this.option = option;
    if (!Server) {
      if (DevServer) {
        Server = DevServer;
      } else {
        throw new Error(
          chalk.red(
            'ProxySwitchPlugin Error: Cannot find Server from parameter, try "npm i webpack-dev-server -D" to solve this problem'
          )
        );
      }
    }
  }

  apply() {
    const option = this.option;
    const proxyKeys = Object.keys(option.proxyList || {});
    // break if nothing in proxylist
    if (!proxyKeys.length) return;

    // version 3
    if (typeof Server.prototype.setupFeatures === "function") {
      const setupFeatures = Server.prototype.setupFeatures;

      Server.prototype.setupFeatures = function () {
        this.options.proxy = proxyFactory(
          option.proxyList[option.defaultProxy || proxyKeys[0]]
        );
        this.app.get("/proxy/list", (req, res) => {
          res.status(200).json({
            list: proxyKeys,
            defaultProxy: option.defaultProxy,
          });
        });
        this.app.get("/proxy/change", async (req, res) => {
          const { proxy } = req.query;
          this.options.proxy = proxyFactory(option.proxyList[proxy]);
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
          this.options.proxy = proxyFactory(
            option.proxyList[option.defaultProxy || proxyKeys[0]]
          );
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
          this.options.proxy = proxyFactory(option.proxyList[proxy]);
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
