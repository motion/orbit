//

// WARNING WARNING
// TURN OFF PRETTIER ON THIS FILE IT DESTROYS THE REGEX
// WARNING

const Path = require('path')
const Fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const getClientEnvironment = require('./env')
const paths = require('./paths')
const publicPath = '/'
const publicUrl = ''
const env = getClientEnvironment(publicUrl)
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const BabiliPlugin = require('babili-webpack-plugin')
const ButternutWebpackPlugin = require('butternut-webpack-plugin').default
const PrepackPlugin = require('prepack-webpack-plugin').default
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const ROOT = Path.join(__dirname, '..', '..', '..', '..')
const IS_PROD = process.env.NODE_ENV === 'production'
const IS_DEV = !IS_PROD
const filtered = ls => ls.filter(x => !!x)

const ORG = Path.resolve(__dirname, '..', '..', 'node_modules', '@mcro')
const includes = Fs.readdirSync(ORG).map(folder =>
  Path.resolve(ORG, folder, 'src')
)

console.log('includes', includes)

console.log('running webpack for:', process.env.NODE_ENV)

let config

if (IS_PROD) {
  config = {
    devtool: 'source-map',
    // bail: true,
  }
} else {
  config = {
    devtool: 'cheap-module-source-map',
  }
}

console.log(Path.resolve(ROOT, 'node_modules', '@mcro', 'ui'))

module.exports = Object.assign(config, {
  entry: {
    app: filtered([
      IS_DEV && require.resolve('webpack-dev-server/client') + '?/',
      IS_DEV && require.resolve('webpack/hot/only-dev-server'),
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
    mainFields: ['module', 'esnext', 'jsnext:main', 'main'],
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
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@mcro/preset-motion',
                {
                  disable: ['@mcro/hmr', '@mcro/hmr-view'],
                  env: {
                    targets: {
                      chrome: '58',
                    },
                  },
                },
              ],
            ],
          },
        },
        test: /\.js$/,
        exclude: new RegExp('node_modules\\' + Path.sep + '(?!@mcro).*'),
        include: [].concat(includes, [
          Path.resolve(__dirname, '..', '..', 'src'),
        ]),
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
    new CaseSensitivePathsPlugin(),
    // hmr
    IS_DEV && new webpack.HotModuleReplacementPlugin(),
    IS_DEV && new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    // readable names
    new webpack.NamedModulesPlugin(),
    // vendor
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'node-static',
    //   filename: 'node-static.js',
    //   minChunks(module, count) {
    //     var context = module.context
    //     return context && context.indexOf('node_modules') >= 0
    //   },
    // }),

    // production
    IS_PROD && new webpack.optimize.OccurrenceOrderPlugin(),
    // IS_PROD && new ButternutWebpackPlugin({}),
    // IS_PROD && new BabiliPlugin(),
    // IS_PROD && new PrepackPlugin(),
    // IS_PROD && new UglifyJSPlugin(),

    // bundle analyzer
    process.env.DEBUG && new BundleAnalyzerPlugin(),
  ]),
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
})
