const HtmlWebpackPlugin = require("html-webpack-plugin");
const { join, resolve } = require("path");
const argv = require("yargs-parser")(process.argv.slice(2));
const _env = argv.env || "dev";
const _envConfig = require(`./envConfig/env.${_env}.js`);

const devWebpackConfig = {
  mode: "development",
  output: {
    publicPath: "/", // webpack serve developement
    assetModuleFilename: "images/[name].[ext]",
    filename: "scripts/[name].bundle.js",
  },
  devServer: {
    historyApiFallback: true,
    static: join(__dirname, "src"),
    port: 3006,
    hot: true,
    open: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/apiFund': {  // /api 表示拦截以/api开头的请求路径
        target: _envConfig.PUBLIC_DOMAIN_NAME, // 跨域的域名
        changeOrigin: true, // 是否开启跨域
        pathRewrite: {'^/apiFund' : ''}
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: "body",
      scriptLoading: "blocking",
      filename: "index.html",
      template: resolve(__dirname, "../src/index.html"),
    }),
  ],
};

module.exports = devWebpackConfig;
