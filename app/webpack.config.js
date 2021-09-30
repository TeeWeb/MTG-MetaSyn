const path = require("path");

module.exports = {
  output: {
    filename: "webpack.bundle.js",
  },
  module: {
    rules: [
      {
        test: [/\.m?js$/, /\.jsx$/],
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              "@babel/plugin-proposal-object-rest-spread",
              "@babel/plugin-syntax-jsx",
            ],
          },
        },
      },
    ],
  },
};
