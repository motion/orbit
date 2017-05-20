const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')
const BabiliPlugin = require('babili-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const getClientEnvironment = require('./env')
const paths = require('./paths')
const publicPath = '/'
const publicUrl = ''
const env = getClientEnvironment(publicUrl)
const ButternutWebpackPlugin = require('butternut-webpack-plugin').default

const IS_PROD = process.env.NODE_ENV === 'production'
const IS_DEV = !IS_PROD
const filtered = ls => ls.filter(x => !!x)

console.log('running webpack for:', process.env.NODE_ENV)

// TODO
// service workers
//  requires: https
//  https://github.com/goldhand/sw-precache-webpack-plugin

let config

if (IS_PROD) {
  config = {
    devtool: 'source-map',
    bail: true,
  }
} else {
  config = {
    devtool: 'cheap-module-source-map',
  }
}

module.exports = Object.assign(config, {
  entry: {
    app: filtered([
      IS_DEV && require.resolve('webpack-dev-server/client') + '?/',
      IS_DEV && require.resolve('webpack/hot/dev-server'),
      // IS_DEV && require.resolve('react-dev-utils/webpackHotDevClient'),
      IS_DEV && require.resolve('react-hot-loader/patch'),
      require.resolve('./polyfills'),
      paths.appIndexJs,
    ]),
  },
  output: {
    path: paths.appBuild,
    pathinfo: true,
    filename: 'js/[name].js',
    publicPath: publicPath,
  },

  resolve: {
    extensions: ['.js', '.json'],
    // WARNING: messing with this order is dangerous af
    // TODO: can add root monorepo node_modules and then remove a lot of babel shit
    modules: [paths.modelsNodeModules, paths.appNodeModules, 'node_modules'],
    // since were forced into full lodash anyway, lets dedupe
    alias: {
      'lodash.merge': 'lodash/merge',
      'lodash.isequal': 'lodash/isEqualWith',
      'lodash.bind': 'lodash/bind',
      'lodash.some': 'lodash/some',
      'lodash.map': 'lodash/map',
      'lodash.reduce': 'lodash/reduce',
      'lodash.reject': 'lodash/reject',
      'lodash.foreach': 'lodash/forEach',
      'lodash.filter': 'lodash/filter',
      'lodash.flatten': 'lodash/flatten',
      'lodash.pick': 'lodash/pick',
    },
  },

  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/,
      },
    ],
  },

  plugins: filtered([
    new InterpolateHtmlPlugin(env.raw),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    new webpack.DefinePlugin(env.stringified),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    new webpack.NamedModulesPlugin(),

    // split out vendor files
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks: Infinity, // ensure only stuff we list
    // }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'node-static',
      filename: 'node-static.js',
      minChunks(module, count) {
        var context = module.context
        return context && context.indexOf('node_modules') >= 0
      },
    }),

    // production
    IS_PROD && new webpack.optimize.OccurrenceOrderPlugin(),
    // IS_PROD && new ButternutWebpackPlugin({}),
    IS_PROD && new BabiliPlugin(),

    // bundle analyzer
    process.env.DEBUG && new BundleAnalyzerPlugin(),
  ]),
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
})
