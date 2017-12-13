//

// WARNING WARNING
// TURN OFF PRETTIER ON THIS FILE IT DESTROYS THE REGEX
// WARNING

const Path = require('path')
const Fs = require('fs')
const Paths = require('./paths')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')
const getClientEnvironment = require('./env')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
// const BabelMinifyPlugin = require('babel-minify-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
// const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')

const IS_PROD = process.env.NODE_ENV === 'production'
const MINIFY = process.env.MINIFY === 'true'
const IS_DEV = !IS_PROD
const TARGET = process.env.TARGET
const HAS_HTML = Fs.existsSync(Paths.appHtml)
const CHUNK_COMMONS = process.env.CHUNK_COMMONS !== 'false'

console.log('IS_PROD', IS_PROD)

const filtered = ls => ls.filter(x => !!x)
const watch = process.argv.indexOf('--watch') > 0
const publicUrl = ''
const env = getClientEnvironment(publicUrl)

const BINDINGS_PATH =
  Fs.existsSync(Paths.resolve('bindings')) && Paths.resolve('bindings')

const BROWSER_MAINS = IS_DEV
  ? ['module', 'browser', 'main', 'es6']
  : ['browser', 'module:production', 'main', 'es6']
const SOMEONE_GET_THEY_MAINS = TARGET ? ['module', 'main'] : BROWSER_MAINS
const MAIN_FIELDS = process.env.MAIN_FIELDS || SOMEONE_GET_THEY_MAINS

// if you want to parse our modules directly use this, but we have dist/ folder now
// const ORG = Path.resolve(__dirname, '..', '..', 'node_modules', '@mcro')
// const includes = Fs.readdirSync(ORG).map(folder => Path.resolve(ORG, folder))

console.log('running webpack for:', process.env.NODE_ENV, 'watching', watch)

let config

if (IS_PROD) {
  config = {
    // devtool: false,
    devtool: 'source-map',
    bail: true,
  }
} else {
  config = {
    devtool: 'cheap-module-source-map',
  }
}

if (TARGET) {
  config.target = TARGET
  console.log('target is', config.target)
}

const webpackConfig = Object.assign(config, {
  watch,

  entry: {
    app: filtered([
      IS_DEV && require.resolve('webpack-dev-server/client') + '?/',
      IS_DEV && require.resolve('webpack/hot/only-dev-server'),
      Paths.appEntry,
    ]),
  },

  devServer: IS_DEV && {
    contentBase: Paths.appPublic,
    port: 3002,
  },

  output: {
    path: Paths.appBuild,
    pathinfo: true,
    filename: '[name].js',
    publicPath: '/',
  },

  resolveLoader: {
    modules: [Path.join(__dirname, '..', '..', 'node_modules')],
  },

  resolve: {
    // avoid module field so we pick up our prod build stuff
    mainFields: MAIN_FIELDS,
    extensions: ['.js', '.json'],
    // WARNING: messing with this order is dangerous af
    // TODO: can add root monorepo node_modules and then remove a lot of babel shit
    modules: [Paths.modelsNodeModules, Paths.appNodeModules, 'node_modules'],
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
        use: {
          loader: 'babel-loader',
        },
        test: /\.js$/,
        exclude: /node_modules/,
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
    ],
  },

  plugins: filtered([
    new InterpolateHtmlPlugin(env.raw),
    HAS_HTML &&
      new HtmlWebpackPlugin({
        inject: true,
        template: Paths.appHtml,
      }),
    new webpack.DefinePlugin(env.stringified),
    new CaseSensitivePathsPlugin(),
    // hmr
    IS_DEV && new webpack.HotModuleReplacementPlugin(),
    IS_DEV && new WatchMissingNodeModulesPlugin(Paths.appNodeModules),
    // readable names
    new webpack.NamedModulesPlugin(),

    BINDINGS_PATH &&
      new webpack.NormalModuleReplacementPlugin(
        /^bindings$/,
        require.resolve(BINDINGS_PATH)
      ),

    // production
    IS_PROD &&
      CHUNK_COMMONS &&
      new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        minChunks(module) {
          var context = module.context
          return context && context.indexOf('node_modules') >= 0
        },
      }),
    IS_PROD && new webpack.optimize.OccurrenceOrderPlugin(),
    MINIFY &&
      new UglifyJSPlugin({
        cache: true,
        parallel: true,
      }),

    // new DuplicatePackageCheckerPlugin(),
    // slower
    // MINIFY &&
    //   new BabelMinifyPlugin({
    //     deadcode: true,
    //     mangle: { topLevel: true },
    //   }),

    // bundle analyzer
    process.env.DEBUG && new BundleAnalyzerPlugin(),
  ]),
  node: TARGET
    ? false
    : {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
      },
})

console.log('webpackConfig', webpackConfig)

module.exports = webpackConfig
