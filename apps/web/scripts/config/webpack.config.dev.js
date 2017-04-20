'use strict'

var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
var WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')
var getClientEnvironment = require('./env')
var paths = require('./paths')

var publicPath = '/'
var publicUrl = ''
var env = getClientEnvironment(publicUrl)

module.exports = {
  devtool: 'cheap-module-source-map',

  entry: [
    // require.resolve('react-hot-loader/patch'),
    require.resolve('react-dev-utils/webpackHotDevClient'),
    require.resolve('./polyfills'),
    paths.appIndexJs,
  ],

  output: {
    path: paths.appBuild,
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    filename: 'static/js/bundle.js',
    publicPath: publicPath,
  },

  resolve: {
    extensions: ['.js', '.json'],
    modules: [paths.appNodeModules, paths.modelsNodeModules, 'node_modules'],
  },

  module: {
    loaders: [
      {
        exclude: [/\.html$/, /\.(js)(\?.*)?$/, /\.css$/, /\.json$/, /\.svg$/],
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      // Process JS with Babel.
      {
        test: /\.js$/,
        include: paths.appSrc,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.css$/,
        loader: 'style!css?importLoaders=1',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.svg$/,
        loader: 'file',
        query: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ],
  },

  plugins: [
    new InterpolateHtmlPlugin(env.raw),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    new webpack.DefinePlugin(env.stringified),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
}
