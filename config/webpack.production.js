const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const prodWebpackConfig = {
  mode: "production",
  output: {
    assetModuleFilename: "images/[name].[contenthash:5].bundle.[ext]",
    filename: "scripts/[name].[contenthash:5].bundle.js",
    publicPath: "/",
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
    minimize: true,
    runtimeChunk: {
      name: "runtime",
    },
    splitChunks: {
      chunks: "async", // initial all  函数
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: false,
      cacheGroups: {
        commons: {
          chunks: "initial",
          minChunks: 2,
          name: "commons",
        },
      },
      minSize: {
        javascript: 100000,
        style: 100000,
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      inject: "body",
      scriptLoading: "blocking",
      template: resolve(__dirname, "../src/index.html"),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
  ],
};

module.exports = prodWebpackConfig;
