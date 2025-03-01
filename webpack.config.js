/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = async (env, argv) => {
  const webpackConfig = {
    entry: {
      // webpack will complain with `Field 'browser' doesn't contain a valid alias configuration` if `./` is missing in the path
      app: "./src/index.tsx",
    },

    output: {
      path: `${__dirname}/dist`,
      filename: "bundle.js",
      publicPath: "/",
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 1000000,
    },
    module: {
      rules: [
        {
          test: /^((?!\.test\.ts).)*\.tsx?$/,
          loader: "ts-loader",
          options: { allowTsInNodeModules: true },
        },
        {
          test: /\.(sa|c)ss$/,
          use: [
            // MiniCssExtractPlugin.loader,
            argv.mode === "development"
              ? { loader: "style-loader" }
              : {
                  loader: MiniCssExtractPlugin.loader,
                  options: { publicPath: "" },
                },
            {
              loader: "css-loader",
              options: {
                modules: {
                  auto: true,
                },
              },
            },
          ],
        },
      ],
    },

    resolve: {
      extensions: [".ts", ".tsx", ".js", ".json", ".css"],
      fallback: {
        process: require.resolve("process/browser"),
        buffer: require.resolve("buffer/"),
      },
      alias: {
        "process/browser": require.resolve("process/browser.js"),
      },
    },
    plugins: [
      new Dotenv(),
      new MiniCssExtractPlugin({
        filename: "[name].[fullhash].css",
        chunkFilename: "[id].[fullhash].css",
      }),
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: __dirname + "/public/index.html",
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: "public/assets/**/*" }],
      }),
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
      }),
      new webpack.DefinePlugin({
        BUILD_DATETIMESTAMP: `"${new Date().toLocaleString()}"`,
        BUILD_VERSION: `"ZMI-V1.0.0"`,
        PEERJS_PORT: 443,
      }),
      // argv.mode === "development" &&
      //   new webpack.DefinePlugin({
      //     "process.env.REACT_APP_API_ORIGIN": '"http://localhost:3000/api"', // change this
      //   }),
      // argv.mode === "production" &&
      //   new webpack.DefinePlugin({
      //     "process.env.REACT_APP_API_ORIGIN": '"https://zmiapi.azurewebsites.net/api"', // change this
      //   }),
    ],
    stats: {
      errorDetails: true,
    },
  };

  if (argv.mode === "development")
    return {
      ...webpackConfig,

      devtool: "source-map",
      devServer: {
        // contentBase: "./dist",
        hot: true,
        compress: true,
        historyApiFallback: true,
      },
    };
  if (argv.mode === "development")
    return {
      ...webpackConfig,

      devtool: "source-map",
      devServer: {
        // contentBase: "./dist",
        hot: true,
        filename: "bundle.js",
        publicPath: "/",
        historyApiFallback: true,
        contentBase: ["/", "/public"],
      },
    };

  return webpackConfig;
};
