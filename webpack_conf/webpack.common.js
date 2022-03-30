import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  entry: {
    main: "./client/index.js",
  },
  output: {
    filename: "[name]-[contenthash].bundle.js",
    path: path.resolve(__dirname, "../dist"),
  },
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
          },
          "sass-loader",
        ],
      },
    ],
  },
};
