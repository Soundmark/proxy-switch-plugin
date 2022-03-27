var Server;
var chalk = require("chalk");
try {
    Server = require("webpack-dev-server");
}
catch (e) {
    console.log(chalk.yellow("Warning: Cannot find module webpack-dev-server, try deliver it via parameter"));
}
var ProxySwitchPlugin = (function () {
    function ProxySwitchPlugin(option, DevServer) {
        this.option = option;
        if (!Server) {
            if (DevServer) {
                Server = DevServer;
            }
            else {
                throw new Error(chalk.red('Error: Cannot find Server from parameter, try "npm i webpack-dev-server -D" to solve this problem'));
            }
        }
    }
    ProxySwitchPlugin.prototype.apply = function () {
        var setupMiddlewares = Server.prototype.setupMiddlewares;
        Server.prototype.setupMiddlewares = function (middlewares, devServer) {
            this.app.get("/proxy/list", function (req, res) {
                res.status(200).json({
                    list: [
                        { label: "peter", value: "peter" },
                        { label: "park", value: "park" },
                    ],
                });
            });
            this.app.get("/proxy/change", function (req, res) {
                var proxy = req.query.proxy;
                console.log(proxy);
                res.status(200);
            });
            this.baseRouteStackLength = this.app._router.stack.length;
            setupMiddlewares.call(this, middlewares, devServer);
        };
    };
    return ProxySwitchPlugin;
}());
module.exports = ProxySwitchPlugin;
//# sourceMappingURL=ProxySwitchPlugin.js.map