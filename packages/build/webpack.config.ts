// @ts-ignore
import webpack from 'webpack'
import * as Path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin'
// import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin'

const mode = process.env.NODE_ENV || 'development'
const isProd = mode === 'production'
const entry = process.env.ENTRY || './src'
const path = Path.join(process.cwd(), 'dist')
const buildNodeModules =
  process.env.WEBPACK_MODULES || Path.join(__dirname, '..', 'node_modules')

console.log('outputting to', path)

const config = {
  mode,
  entry,
  output: {
    path,
    filename: 'bundle.js',
    publicPath: '/',
  },
  devtool: isProd ? 'source-map' : 'cheap-module-source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    mainFields: isProd ? ['module', 'browser', 'main'] : ['browser', 'main'],
    // modules: [Path.join(entry, 'node_modules'), buildNodeModules],
  },
  resolveLoader: {
    modules: [buildNodeModules],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['thread-loader', 'babel-loader'],
        exclude: ['node_modules'],
      },
      {
        test: /\.tsx?$/,
        use: ['thread-loader', 'babel-loader', 'ts-loader'],
        exclude: ['node_modules'],
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]',
          },
        },
      },
      // {
      //   test: /\.svg$/,
      //   use: 'svg-inline-loader',
      // },
      {
        test: /\.(gif|png|jpe?g|svg)$/,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new DuplicatePackageCheckerPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new HardSourceWebpackPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      favicon: 'public/favicon.png',
      template: 'index.html',
    }),
    // isProd &&
    //   new UglifyJsPlugin({
    //     // uglifyOptions: {
    //     //   ecma: 8,
    //     //   toplevel: true,
    //     // },
    //     sourceMap: true,
    //     parallel: 2,
    //   }),
    process.argv.indexOf('--report') > 0 &&
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      }),
  ].filter(Boolean),
}

export default config
