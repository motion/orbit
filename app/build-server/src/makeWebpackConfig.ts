import HtmlWebpackPlugin from 'html-webpack-plugin'
import * as Path from 'path'
import webpack from 'webpack'

const TerserPlugin = require('terser-webpack-plugin')

export type WebpackParams = {
  entry: string[]
  projectRoot: string
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
}

export async function makeWebpackConfig(appName: string, params: WebpackParams) {
  let {
    outputFile,
    entry,
    publicPath = '/',
    projectRoot,
    mode = 'development' as any,
    output,
    outputDir = Path.join(projectRoot, 'dist'),
    externals,
    ignore = [],
    watch,
    dll,
    dllReference,
    devServer,
    hot,
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
      splitChunks: false,
    },
    development: {
      noEmitOnErrors: true,
      removeAvailableModules: true,
      // namedModules: true,
      // remove some stuff even in dev
      // concatenateModules: true,
      sideEffects: true,
      providedExports: true,
      usedExports: true,
      splitChunks: false,
    },
  }

  // const modulesDir = Path.resolve(projectRoot, '..', '..', 'node_modules')

  const config: webpack.Configuration = {
    watch,
    context: projectRoot,
    target,
    mode,
    entry: {
      main: hot
        ? [`webpack-hot-middleware/client?name=${appName}&path=/__webpack_hmr`, ...entry]
        : entry,
    },
    optimization: optimization[mode],
    output: {
      path: outputDir,
      pathinfo: mode === 'development',
      filename: outputFile || 'index.js',
      ...output,
      publicPath,
      // fixes react-hmr bug, pending
      // https://github.com/webpack/webpack/issues/6642
      globalObject: "(typeof self !== 'undefined' ? self : this)",

      hotUpdateChunkFilename: `hot/${appName}-hot-update.js`,
      hotUpdateMainFilename: `hot/${appName}-hot-update.json`,
    },
    // @ts-ignore
    devServer: devServer
      ? {
          stats: {
            warnings: false,
          },
          historyApiFallback: true,
          hot: mode === 'development',
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      : undefined,
    devtool: 'source-map',
    // mode === 'production' || target === 'node' ? 'source-map' : 'cheap-module-eval-source-map',
    externals: [externals, { electron: '{}' }],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      mainFields:
        mode === 'production'
          ? ['ts:main', 'module', 'browser', 'main']
          : ['ts:main', 'browser', 'main'],
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
      new webpack.DefinePlugin(defines),

      !dll &&
        target !== 'node' &&
        new HtmlWebpackPlugin({
          template: Path.join(__dirname, '..', 'index.html'),
          chunksSortMode: 'none',
          inject: false,
          externals: ['apps.js'],
        }),

      mode === 'production' &&
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            ecma: 6,
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
          context: projectRoot,
        }),

      hot && new webpack.HotModuleReplacementPlugin(),

      // mode === 'development' && new webpack.NamedModulesPlugin(),
    ].filter(Boolean) as webpack.Plugin[],
  }

  console.log('made config', JSON.stringify(config, null, 2))

  return config
}
