const { resolve } = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const argv = require("yargs-parser")(process.argv.slice(2));
const WebpackBar = require("webpackbar");
const _mode = argv.mode || "development";
const _env = argv.env || "dev";
const _modeFlag = _mode === "production";
const _mergeConfig = require(`./config/webpack.${_mode}.js`);
const _envConfig = require(`./config/envConfig/env.${_env}.js`);
const paths = require("./config/paths");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// 扩展环境变量
const globalConstants = () => {
  const appliedConstants = {};
  Object.keys(_envConfig).forEach((key) => {
    appliedConstants[key] = JSON.stringify(_envConfig[key]);
  });
  return appliedConstants;
};

// css loader
const cssLoader = [
  {
    loader: "css-loader",
    options: {
      modules: {
        localIdentName: "[local]_[hash:base64:5]",
      },
    },
  },
  "postcss-loader",
  {
    loader: 'less-loader',
    options: {
      lessOptions: {
        javascriptEnabled: true
      }
    }
  }
];

const webpackConfig = {
  entry: {
    app: paths.appIndexJs,
  },
  output: {
    path: paths.appBuild,
  },
  cache: {
    type: "filesystem",
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(css)$/i,
        exclude: [paths.appNodeModules],
        use: [
          "style-loader",
          ...cssLoader
        ],
      },
      {
        test: /\.css$/i,
        exclude: [paths.appSrc],
        use: [
          "style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.(less)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          ...cssLoader
        ],
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(png|jpg|svg)$/,
        type: "asset",
      },
    ],
  },
  resolve: {
    alias: {
      "@assets": resolve("src/assets"),
      "@components": resolve("src/components"),
      "@routes": resolve("src/routes"),
      "@pages": resolve("src/pages"),
      "@utils": resolve("src/utils"),
      "@api": resolve("src/api"),
      "@layouts": resolve("src/layouts"),
      "@services": resolve("src/services"),
    },
    extensions: [".ts", ".tsx", ".js", ".json", ".jsx"],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: _modeFlag
        ? "styles/[name].[contenthash:5].css"
        : "styles/[name].css",
      chunkFilename: _modeFlag
        ? "styles/[name].[contenthash:5].css"
        : "styles/[name].css",
      ignoreOrder: false,
    }),
    new WebpackBar(),
    new webpack.DefinePlugin(globalConstants()),
  ],
};

module.exports = merge.default(webpackConfig, _mergeConfig);
