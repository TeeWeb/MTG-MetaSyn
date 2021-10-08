const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + "/src/static/index.html",
  filename: "index.html",
  inject: "body",
});
const mode =
  process.env.NODE_ENV === "production" ? "production" : "development";

module.exports = {
  target: "node",
  externals: [nodeExternals()],
  externalsPresets: {
    node: true,
  },
  plugins: [HTMLWebpackPluginConfig, new BundleAnalyzerPlugin()],
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: 1234,
  },
  mode,
  module: {
    rules: [
      {
        test: [/\.m?js$/, /\.jsx$/],
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: [/\.html$/, /\.html$/],
        use: {
          loader: "html-loader",
        },
      },
      {
        test: [/\.css$/i],
        use: ["style-loader", "css-loader"],
      },
      {
        test: [/\.png$/],
        use: [{ loader: "file-loader" }],
      },
    ],
  },
  devtool: "source-map",
  resolve: {
    fallback: {
      net: false,
      tls: false,
      http: false,
      https: false,
      crypto: false,
      stream: false,
      zlib: false,
      fs: false,
      os: false,
      path: false,
      util: false,
      assert: false,
      buffer: false,
    },
  },
};
