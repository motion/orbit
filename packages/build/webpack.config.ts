import * as Path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'

const config = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src',
  output: {
    path: Path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  devtool: 'cheap-module-source-map', //'cheap-eval-source-map',
  resolveLoader: {
    modules: [Path.join(__dirname, '..', 'node_modules')],
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
        use: ['ts-loader', 'babel-loader'],
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
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
}

export default config
