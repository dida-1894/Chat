const webpack = require('webpack');
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin')

const { NODE_ENV = 'development', PORT = 3100 } = process.env
module.exports = {
  entry: path.resolve(__dirname, './zclient/index.js'),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
},
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  mode: NODE_ENV,
  output: {
    path: path.resolve(__dirname, './public'),
    filename: 'bundle.js',
  },
  plugins: [new webpack.HotModuleReplacementPlugin(),new HtmlPlugin({
    template: './public/index.html',
  })],
  devServer: {
    port: PORT,
    static: path.resolve(__dirname, './public'),
    compress: true,
    hot: true,
  },
};