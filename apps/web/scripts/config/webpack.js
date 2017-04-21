const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')
const getClientEnvironment = require('./env')
const paths = require('./paths')
const publicPath = '/'
const publicUrl = ''
const env = getClientEnvironment(publicUrl)

const IS_PROD = process.env.NODE_ENV === 'production'
const IS_DEV = !IS_PROD
const filtered = ls => ls.filter(x => !!x)

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
  entry: filtered([
    // require.resolve('react-hot-loader/patch'),
    IS_DEV && require.resolve('react-dev-utils/webpackHotDevClient'),
    require.resolve('./polyfills'),
    paths.appIndexJs,
  ]),

  output: {
    path: paths.appBuild,
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    filename: 'static/js/bundle.js',
    publicPath: publicPath,
  },

  resolve: {
    extensions: ['.js', '.json'],
    // WARNING: messing with this order is dangerous af
    modules: [paths.modelsNodeModules, paths.appNodeModules, 'node_modules'],
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

    // production
    IS_PROD &&
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: false,
        },
        mangle: {
          screw_ie8: true,
        },
        output: {
          comments: false,
          screw_ie8: true,
        },
      }),

    IS_PROD && new webpack.optimize.OccurrenceOrderPlugin(),
  ]),
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
})
