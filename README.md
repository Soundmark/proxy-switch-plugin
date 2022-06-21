简体中文 | [English](./README.en-US.md)

# proxy-switch-plugin

[![npm][npm]][npm-url]

基于`webpack-dev-server`，通过装饰`webpack-dev-server`实现不重启服务切换代理，理论上基于`webpack-dev-server`启动的服务都能够使用。

## 安装

```cmd
// npm
npm i proxy-switch-plugin -D

//yarn
yarn add proxy-switch-plugin -D
```

## 使用

### 配置

通过`webpack`配置使用：

```javascript
const ProxySwitchPlugin = require("proxy-switch-plugin");
module.exports = {
  // ...
  plugins: [
    new ProxySwitchPlugin({
      // 将你所有的proxy配置写进来
      proxyList: {
        小明: {
          "/api": {
            target: "http://localhost:3000",
            pathRewrite: {
              "/api": "/",
            },
          },
        },
        小红: {
          "/api": {
            target: "http://localhost:3001",
            pathRewrite: {
              "/api": "/",
            },
          },
        },
      },
      // 默认的proxy配置的key
      defaultProxy: "小红",
      // 监控配置变化
      watchPath: path.join(__dirname, "webpack.config.js"),
    }),
  ],
  // ...
};
```

通过`chainWebpack`配置使用：

```javascript
const ProxySwitchPlugin = require("proxy-switch-plugin");
module.exports = {
  // ...
  chainWebpack: (config) => {
    config.plugin("proxy-switch-plugin").use(ProxySwitchPlugin, [
      {
        // 将你所有的proxy配置写进来
        proxyList: {
          小明: {
            "/api": {
              target: "http://localhost:3000",
              pathRewrite: {
                "/api": "/",
              },
            },
          },
          小红: {
            "/api": {
              target: "http://localhost:3001",
              pathRewrite: {
                "/api": "/",
              },
            },
          },
        },
        // 默认的proxy配置的key
        defaultProxy: "小红",
        // 监控配置变化
        watchPath: path.join(__dirname, "vue.config.js"),
      },
    ]);
  },
  // ...
};
```

> 注意：使用了这个插件之后，你不应该再去配置`webpack.devServer.proxy`。你应该按照上述实例的方式来写 proxy 配置，这是 proxy 的经典配置写法，其他写法不确保成功。

### 切换代理

插件提供了默认的 select 组件，以`React`为例，你可以这样使用：

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

将 select 组件放到你认为合适的地方，通过选择不同代理的 key 名就可以切换代理。

当然，默认的 select 组件通过 html 的 select 组件来编写的，样式方面可能不尽人意，你也可以自己实现代理切换组件，插件提供了两个接口来实现这个功能：

#### 获取 proxy 列表

- url: /proxy/list
- method: GET
- res: {list: string[]}

#### 切换 proxy 代理

- url: /proxy/change
- params: {proxy: string}
- method: GET

### 配置热更新(实验性功能)

通过`watchPath`传入 webpack 配置文件的路径可实现配置热更新，即增删改 proxy 配置时也无需重启项目，仅通过刷新页面即可实现配置更新。

## 协议

#### [MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/proxy-switch-plugin.svg
[npm-url]: https://www.npmjs.com/package/proxy-switch-plugin
