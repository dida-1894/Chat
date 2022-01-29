const webpack = require('webpack');
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');



const { NODE_ENV = 'development', PORT = 3100 } = process.env
const isDev = NODE_ENV == 'development';

module.exports = {
  entry: path.resolve(__dirname, './zclient/index.js'),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader','css-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader','css-loader','less-loader']
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  mode: NODE_ENV,
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
    ,new HtmlPlugin({
      template: './public/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].min.css',
      chunkFilename: '[name].min.css',
    }),
  ],
  devServer: {
    port: PORT,
    historyApiFallback: { index: "/", disableDotRule: true },
    static: path.resolve(__dirname, './public'),
    compress: true,
    hot: true,
  },
};