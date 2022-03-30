import HtmlWebpackPlugin from "html-webpack-plugin";

import { merge } from "webpack-merge";

import common from "./webpack.common.js";

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));


export default merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  watch: true,
  plugins: [
    new HtmlWebpackPlugin({
      // name this file main, so that it does not get automatically requested as a static file
      filename: "main.html",
      template: path.resolve(__dirname, "..", "client", "main.html"),
    }),
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx)$/, // regex to see which files to run babel on
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
});
