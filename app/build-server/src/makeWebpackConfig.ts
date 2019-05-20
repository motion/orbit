import * as Path from 'path'
import webpack from 'webpack'

const TerserPlugin = require('terser-webpack-plugin')

export type WebpackParams = {
  entry: string
  projectRoot: string
  publicPath?: string
  mode?: 'production' | 'development'
  target?: 'node' | 'electron-renderer' | 'web'
  outputFile?: string
  output?: any
  externals?: any
  ignore?: string[]
}

export async function makeWebpackConfig(params: WebpackParams) {
  let {
    outputFile,
    entry,
    publicPath = '/',
    projectRoot,
    mode = 'development',
    output,
    externals,
    ignore = [],
  } = params

  console.log('makeWebpackConfig', mode, 'got params', params)

  const target = params.target || 'electron-renderer'
  const outputPath = Path.join(projectRoot, 'dist')
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
      concatenateModules: true,
      sideEffects: true,
      providedExports: true,
      usedExports: true,
      splitChunks: false,
    },
  }

  const entryPath = Path.join(projectRoot, entry)

  const config = {
    context: projectRoot,
    target,
    mode,
    entry,
    optimization: optimization[mode],
    output: {
      path: outputPath,
      pathinfo: mode === 'development',
      filename: outputFile || 'index.js',
      ...output,
      publicPath,
      // fixes react-hmr bug, pending
      // https://github.com/webpack/webpack/issues/6642
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
    devtool:
      mode === 'production' || target === 'node' ? 'source-map' : 'cheap-module-eval-source-map',
    externals,
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
            return entryPath === x || x.indexOf('.node.ts') > -1
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

      new webpack.IgnorePlugin({
        checkResource(resource) {
          if (ignore.find(x => resource.indexOf(x) > -1)) {
            return true
          }
          return false
        },
      }),

      mode === 'production' &&
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            ecma: 6,
          },
        }),

      // mode === 'development' && new webpack.NamedModulesPlugin(),
    ].filter(Boolean),
  }

  return config
}
