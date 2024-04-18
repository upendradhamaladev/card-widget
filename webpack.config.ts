import path from "path";
import { Configuration, ProvidePlugin } from "webpack";
import CopyWebpackPlugin from "copy-webpack-plugin";
import Dotenv from "dotenv-webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const config: Configuration = {
  mode: "production",
  entry: "./src/index.tsx",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            compilerOptions: {
              noEmit: false,
            },
          },
        },
        exclude: /node_modules|\.d\.ts$/,
      },
      {
        test: /\.d\.ts$/,
        loader: "ignore-loader",
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.svg$/, // File extension to match
        use: [
          "@svgr/webpack",
          {
            loader: "file-loader",
          },
        ], // SVG loader (using @svgr/webpack to convert SVG to React components)
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      assert: require.resolve("assert"),

      buffer: require.resolve("buffer"),

      stream: require.resolve("stream-browserify"),

      crypto: require.resolve("crypto-browserify"),

      zlib: require.resolve("browserify-zlib"),

      http: require.resolve("stream-http"),

      https: require.resolve("https-browserify"),

      vm: require.resolve("vm-browserify"),

      path: require.resolve("path-browserify"),

      os: require.resolve("os-browserify/browser"),
    },
  },
  target: "web",
  output: {
    library: "ZebecCard",
    libraryTarget: "window",
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    umdNamedDefine: true,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "public" }],
    }),
    new Dotenv(),
    new ProvidePlugin({
      process: "process/browser",
    }),
    new MiniCssExtractPlugin({
      filename: "bundle.css",
      chunkFilename: "bundle.css",
    }),
  ],
};

export default config;
