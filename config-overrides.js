const { ProvidePlugin } = require("webpack");

module.exports = function (config, env) {
  return {
    ...config,

    module: {
      ...config.module,

      rules: [
        ...config.module.rules,

        {
          test: /\.(m?js|ts)$/,

          resolve: {
            fullySpecified: false,
          },

          enforce: "pre",

          use: ["source-map-loader"],
        },
        // {
        //   test: /\.svg$/i,
        //   type: "asset",
        //   resourceQuery: /url/,
        // },
        // {
        //   test: /\.svg$/i,
        //   issuer: /\.[jt]sx?$/,
        //   resourceQuery: { not: [/url/] },
        //   use: [{ loader: "@svgr/webpack", options: { icon: true } }],
        // },
      ],
    },

    plugins: [
      ...config.plugins,

      new ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
      }),
    ],

    resolve: {
      ...config.resolve,

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

    ignoreWarnings: [/Failed to parse source map/],
  };
};