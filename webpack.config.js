//webpack.config.js
const path = require('path');

module.exports = {
  mode: "development",
  entry: {
    main: "./src/Loader.ts",
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: "answer.ts.min.js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      { 
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  },
  optimization: {
    minimize: true
  }
};