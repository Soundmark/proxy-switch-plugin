var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        var normalizeOptions = Server.prototype.normalizeOptions;
        var option = this.option;
        var proxyKeys = Object.keys(option.proxyList);
        Server.prototype.normalizeOptions = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.options.proxy =
                                option.proxyList[(option === null || option === void 0 ? void 0 : option.defaultProxy) || proxyKeys[0]];
                            return [4, normalizeOptions.call(this)];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            });
        };
        Server.prototype.setupMiddlewares = function (middlewares, devServer) {
            console.log(this.options.proxy);
            this.app.get("/proxy/list", function (req, res) {
                res.status(200).json({
                    list: proxyKeys,
                    defaultProxy: option.defaultProxy,
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