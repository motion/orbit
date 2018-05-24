// @ts-ignore
import webpack from 'webpack'
import * as Path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

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
  devtool: 'cheap-module-source-map', //'cheap-eval-source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    // modules: [Path.join(entry, 'node_modules'), buildNodeModules],
  },
  resolveLoader: {
    modules: [buildNodeModules],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: ['node_modules'],
      },
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'ts-loader'],
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
      {
        test: /\.svg$/,
        use: 'svg-inline-loader',
      },
      {
        test: /\.(gif|png|jpe?g)$/,
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
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    false &&
      isProd &&
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      }),
  ].filter(Boolean),
}

export default config
