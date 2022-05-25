# proxy-switch-plugin

[![npm][npm]][npm-url]

Base on `webpack-dev-server`.Decorating `webpack-dev-server` to switch proxy without restart server.You could use it on the server which base on `webpack-dev-server` in theory。

## Getting Started

```cmd
// npm
npm i proxy-switch-plugin -D

//yarn
yarn add proxy-switch-plugin -D
```

## Usage

### Config

In `webpack`：

```javascript
const ProxySwitchPlugin = require("proxy-switch-plugin");
module.exports = {
  // ...
  plugins: [
    new ProxySwitchPlugin({
      // write down all you proxy config
      proxyList: {
        peter: {
          "/api": {
            target: "http://localhost:3000",
            pathRewrite: {
              "/api": "/",
            },
          },
        },
        park: {
          "/api": {
            target: "http://localhost:3001",
            pathRewrite: {
              "/api": "/",
            },
          },
        },
      },
      // the default proxy config key
      defaultProxy: "park",
      // watch config change
      watchPath: path.join(__dirname, "webpack.config.js"),
    }),
  ],
  // ...
};
```

In `chainWebpack`：

```javascript
const ProxySwitchPlugin = require("proxy-switch-plugin");
module.exports = {
  // ...
  chainWebpack: (config) => {
    config.plugin("proxy-switch-plugin").use(ProxySwitchPlugin, [
      {
        // write down all you proxy config
        proxyList: {
          peter: {
            "/api": {
              target: "http://localhost:3000",
              pathRewrite: {
                "/api": "/",
              },
            },
          },
          park: {
            "/api": {
              target: "http://localhost:3001",
              pathRewrite: {
                "/api": "/",
              },
            },
          },
        },
        // the default proxy config key
        defaultProxy: "park",
      },
    ]);
  },
  // ...
};
```

> Note: You should not config `webpack.devServer.proxy` after you use this plugin. And you should config the proxy like the example do which is the classic format in `webpack`. If you use other format, the plugin dosen't promise to work.

### Proxy Switch

The plugin provide a default `select` component. For example, you could use it like this in `React`:

```jsx
import ProxySelect from "proxy-switch-plugin/src/ProxySelect";
import "proxy-switch-plugin/src/ProxySelect.css";

function Index() {
  useEffect(() => {
    document.querySelector(".container").appendChild(ProxySelect);
  }, []);

  return <div className="container"></div>;
}
```

Put the `select` component on the place properly. Switch the proxy by select different proxy key in the `select` component.

Of course, the default `select` component is written by `html select` component. The style may not satisfy you. But you could do this work youself. The plugin provide two interface to help switch proxy:

#### get proxy list

- url: /proxy/list
- method: GET
- res: {list: string[]}

#### switch proxy

- url: /proxy/change
- params: {proxy: string}
- method: GET

### Config Hot Update(Experimental)

By delivering the webpack config file path from the `watchPath` option, we could update our proxy config without restarting the server and just a fast refresh of the page.

> Notice：This is a experimental feature. Only little test have made on typical `webpack` config. `chainWebpack` config have never test yet. Please use it carefully.

## License

#### [MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/proxy-switch-plugin.svg
[npm-url]: https://www.npmjs.com/package/proxy-switch-plugin
