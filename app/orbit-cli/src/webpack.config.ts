import * as Fs from 'fs-extra'
import * as Path from 'path'

import webpack from 'webpack'

const TerserPlugin = require('terser-webpack-plugin')
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')

type Params = {
  projectRoot: string
  mode: 'production' | 'development'
}

async function makeConfig(params: Params) {
  let {
    projectRoot,
    // TODO(andreypopp): switch default to production?
    mode = 'development',
  } = params

  let pkgJson = await Fs.readJson(Path.join(projectRoot, 'package.json'))

  const entry = pkgJson.main || './src/index'
  const target = 'electron-renderer'
  const outputPath = Path.join(projectRoot, 'dist')
  const buildNodeModules = Path.join(__dirname, '..', 'node_modules')

  const defines = {
    'process.platform': JSON.stringify('darwin'),
    'process.env.NODE_ENV': JSON.stringify(mode),
  }

  const optimization = {
    production: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
            priority: 10,
            enforce: true,
          },
        },
      },
    },
    development: {
      noEmitOnErrors: true,
      removeAvailableModules: false,
      namedModules: true,
      // ...optimizeSplit,
    },
  }

  const babelrcOptions = {
    ...JSON.parse(Fs.readFileSync(Path.resolve(projectRoot, '.babelrc'), 'utf-8')),
    babelrc: false,
    // this caused some errors with HMR where gloss-displaynames wouldnt pick up
    // changed view names
    // im presuming because it cached the output and gloss-displaynames needs a
    // redo somehow
    cacheDirectory: true,
  }

  const config = {
    target,
    mode,
    entry,
    optimization: optimization[mode],
    output: {
      path: outputPath,
      pathinfo: mode === 'development',
      filename: 'bundle.js',
      publicPath: '/',
      // fixes react-hmr bug, pending https://github.com/webpack/webpack/issues/6642
      globalObject: "(typeof self !== 'undefined' ? self : this)",
    },
    devServer: {
      stats: {
        warnings: false,
      },
      historyApiFallback: true,
      hot: mode === 'development',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    // for a faster dev mode you can do:
    //   eval-source-map (causes errors to not show stack trace in react development...)
    //   cheap-source-map (no line numbers...)
    //   cheap-module-eval-source-map (seems alright in both...)
    //   cheap-module-source-map (works well in electron, no line numbers in browser...)
    devtool: mode === 'production' ? 'source-map' : 'cheap-module-eval-source-map',
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      mainFields:
        mode === 'production'
          ? ['ts:main', 'module', 'browser', 'main']
          : ['ts:main', 'browser', 'main'],
      alias: {},
    },
    resolveLoader: {
      modules: [buildNodeModules],
    },
    module: {
      rules: [
        {
          test: /[wW]orker\.[jt]sx?$/,
          use: ['workerize-loader'],
          // exclude: /node_modules/,
        },
        // ignore .node.js modules
        {
          test: /\.node.[jt]sx?/,
          use: 'ignore-loader',
        },
        // ignore .electron.js modules if in web mode
        target !== 'electron-renderer' && {
          test: /\.electron.[jt]sx?/,
          use: 'ignore-loader',
        },
        {
          test: /\.tsx?$/,
          use: [
            'thread-loader',
            {
              loader: 'ts-loader',
              options: {
                happyPackMode: true,
                transpileOnly: true, // disable - we use it in fork plugin
              },
            },
            {
              loader: 'babel-loader',
              options: babelrcOptions,
            },
            'react-hot-loader/webpack',
          ],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(ttf|eot|woff|woff2)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'fonts/[name].[ext]',
              },
            },
          ],
        },
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
        {
          test: /\.(mp4)$/,
          use: ['file-loader'],
        },
        {
          test: /\.(md)$/,
          use: 'raw-loader',
        },
      ].filter(Boolean),
    },
    plugins: [
      new ErrorOverlayPlugin(),
      new webpack.DefinePlugin(defines),
      new webpack.IgnorePlugin(/electron-log/),
      mode === 'production' &&
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            ecma: 6,
          },
        }),
      mode === 'development' && new webpack.NamedModulesPlugin(),
    ].filter(Boolean),
  }
  return config
}

export default makeConfig
