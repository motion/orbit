import HtmlWebpackPlugin from 'html-webpack-plugin'
import * as Path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'

const TerserPlugin = require('terser-webpack-plugin')
const TimeFixPlugin = require('time-fix-plugin')

export type WebpackParams = {
  name?: string
  entry?: string[]
  context: string
  publicPath?: string
  mode?: 'production' | 'development'
  target?: 'node' | 'electron-renderer' | 'web'
  outputDir?: string
  outputFile?: string
  output?: any
  externals?: any
  ignore?: string[]
  watch?: boolean
  dll?: string
  dllReference?: string
  devServer?: boolean
  hot?: boolean
  minify?: boolean
}

export function makeWebpackConfig(params: WebpackParams, extraConfig?: any): webpack.Configuration {
  let {
    outputFile,
    entry = [],
    publicPath = '/',
    context,
    mode = 'development' as any,
    output,
    outputDir = Path.join(context, 'dist'),
    externals,
    ignore = [],
    watch = false,
    minify = mode === 'production',
    dll,
    dllReference,
    devServer,
    hot,
    name,
  } = params

  const entryDir = __dirname
  const target = params.target || 'electron-renderer'
  const buildNodeModules = [
    Path.join(__dirname, '..', 'node_modules'),
    Path.join(__dirname, '..', '..', '..', 'node_modules'),
  ]

  const defines = {
    'process.platform': JSON.stringify('darwin'),
    'process.env.NODE_ENV': JSON.stringify(mode),
  }

  const optimization = {
    production: {
      minimize: minify,
      usedExports: true,
      providedExports: true,
      sideEffects: true,
      concatenateModules: true,
      splitChunks: {
        chunks: 'async',
        name: false,
      },
      ...(target === 'node' && {
        splitChunks: false,
      }),
    },
    development: {
      minimize: minify,
      noEmitOnErrors: true,
      removeAvailableModules: false,
      namedModules: true,
      splitChunks: false,
      // node can't keep around a ton of cruft to parse, but in web dev mode need hmr speed
      // so optimize away side effects in node
      ...(target === 'node' && {
        removeAvailableModules: true,
        sideEffects: true,
        providedExports: true,
        usedExports: true,
      }),
    },
  }

  let config: webpack.Configuration = {
    watch,
    context: context,
    target,
    mode,
    entry: {
      main: hot
        ? [`webpack-hot-middleware/client?name=${name}&path=/__webpack_hmr_${name}`, ...entry]
        : entry,
    },
    optimization: optimization[mode],
    output: {
      path: outputDir,
      pathinfo: mode === 'development',
      filename: outputFile || '[name].js',
      ...output,
      publicPath,
      // fixes react-hmr bug, pending
      // https://github.com/webpack/webpack/issues/6642
      globalObject: "(typeof self !== 'undefined' ? self : this)",

      // this makes the first entry fail but not hard reload
      // comment it out for hard reloads, so far no fix seen
      // hotUpdateChunkFilename: `hot-update.js`,
      // hotUpdateMainFilename: `hot-update.json`,
    },
    devtool: mode === 'production' || target === 'node' ? 'source-map' : undefined,
    externals: [{ ...externals, electron: '{}' }],
    resolve: {
      extensions: ['.wasm', '.mjs', '.js', '.jsx', '.ts', '.tsx'],
      mainFields:
        mode === 'production'
          ? ['ts:main', 'module', 'browser', 'main']
          : ['ts:main', 'module', 'browser', 'main'],
      alias: {
        'react-dom': mode === 'production' ? 'react-dom' : '@hot-loader/react-dom',
      },
    },
    resolveLoader: {
      modules: buildNodeModules,
    },
    module: {
      rules: [
        target !== 'node' && {
          test: /.worker\.[jt]sx?$/,
          use: ['workerize-loader'],
          // exclude: /node_modules/,
        },
        // ignore .node.js modules in web modes
        target !== 'node' && {
          test: /\.node.[jt]sx?/,
          use: 'ignore-loader',
        },
        // ignore non-.node.js modules in node mode
        target === 'node' && {
          test: x => {
            // explicit ignores from options
            if (ignore.find(z => z.indexOf(x) > -1)) {
              return true
            }
            // dont ignore if outside of this app source
            if (x.indexOf(entryDir) !== 0) {
              return false
            }
            // ignore if inside this apps src, and not matching our .node pattern (or entry):
            const isValidNodeFile = entry === x || x.indexOf('.node.ts') > -1
            return !isValidNodeFile
          },
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
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    '@o/babel-preset-motion',
                    {
                      disable: target === 'node' ? ['react-hot-loader/babel'] : [],
                    },
                  ],
                ],
              },
            },
            target !== 'node' && 'react-hot-loader/webpack',
          ].filter(Boolean),
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
          test: /\.(md)$/,
          use: 'raw-loader',
        },
      ].filter(Boolean),
    },
    plugins: [
      new TimeFixPlugin(),

      new webpack.DefinePlugin(defines),

      !dll &&
        target !== 'node' &&
        new HtmlWebpackPlugin({
          template: Path.join(__dirname, '..', 'index.html'),
          chunksSortMode: 'none',
          inject: false,
          externals: ['apps.js'],
        }),

      ((mode === 'production' && minify !== false) || minify === true) &&
        new TerserPlugin({
          sourceMap: true,
          parallel: true,
          cache: true,
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 6,
              warnings: false,
            },
            mangle: {
              safari10: true,
            },
            keep_classnames: true,
            output: {
              ecma: 6,
              comments: false,
              beautify: false,
              ascii_only: true,
            },
          },
        }),

      !!dll &&
        new webpack.DllPlugin({
          name: 'main',
          path: dll,
        }),

      !!dllReference &&
        new webpack.DllReferencePlugin({
          manifest: dllReference,
          context: context,
        }),

      hot && new webpack.HotModuleReplacementPlugin(),

      // mode === 'development' && new webpack.NamedModulesPlugin(),
    ].filter(Boolean) as webpack.Plugin[],
  }

  if (devServer) {
    // @ts-ignore
    config.devServer = {
      stats: {
        warnings: false,
      },
      historyApiFallback: true,
      hot,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }
  }

  // console.log('made config', config)

  if (extraConfig) {
    return merge.smart([config, extraConfig])
  }

  return config
}
