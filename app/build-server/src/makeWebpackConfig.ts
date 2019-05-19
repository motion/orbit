import * as Path from 'path'
import webpack from 'webpack'

const TerserPlugin = require('terser-webpack-plugin')

type Params = {
  entry: string
  projectRoot: string
  mode: 'production' | 'development'
  publicPath: string
  target?: 'node' | 'electron-renderer' | 'web'
}

export async function makeWebpackConfig(params: Params) {
  let { entry, publicPath, projectRoot, mode = 'development' } = params

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
    },
  }

  let externals = {
    react: 'React',
    'react-dom': 'ReactDOM',
    '@o/kit': 'OrbitKit',
    '@o/ui': 'OrbitUI',
  }

  const entryPath = Path.join(projectRoot, entry)

  console.log(entryPath, outputPath)

  const config = {
    context: projectRoot,
    target,
    mode,
    entry,
    optimization: optimization[mode],
    output: {
      path: outputPath,
      pathinfo: mode === 'development',
      filename: 'bundle.js',
      // TODO(andreypopp): sort this out, we need some custom symbol here which
      // we will communicate to Orbit
      library: 'window.OrbitAppToRun',
      libraryTarget: 'assign',
      libraryExport: 'default',
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
    devtool: mode === 'production' ? 'source-map' : 'cheap-module-eval-source-map',
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
        {
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
              options: {
                presets: ['@o/babel-preset-motion'],
              },
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
