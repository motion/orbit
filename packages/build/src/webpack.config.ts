import webpack from 'webpack'
import * as Path from 'path'
import * as Fs from 'fs'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
// import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
// import ProfilingPlugin from 'webpack/lib/debug/ProfilingPlugin'
import PrepackPlugin from 'prepack-webpack-plugin'
import { DuplicatesPlugin } from 'inspectpack/plugin'

const cwd = process.cwd()
const readPackage = (key: string) => {
  try {
    const packageJson = Fs.readFileSync(Path.join(cwd, 'package.json'))
    const pkg = JSON.parse(packageJson.toString())
    return pkg[key]
  } catch {
    return null
  }
}

const mode = process.env.NODE_ENV || 'development'
const isProd = mode === 'production'
const entry = process.env.ENTRY || readPackage('main') || './src'
const tsConfig = Path.join(cwd, 'tsconfig.json')
const tsConfigExists = Fs.existsSync(tsConfig)
const outputPath = Path.join(cwd, 'dist')
const buildNodeModules = process.env.WEBPACK_MODULES || Path.join(__dirname, '..', 'node_modules')

const getFlag = flag => {
  const matcher = new RegExp(`${flag} ([a-z0-9]+)`, 'i')
  const found = process.argv.join(' ').match(matcher)
  return (found && found.length >= 2 && found[1]) || null
}

const target = getFlag('--target') || 'web'

console.log('webpack info', JSON.stringify({ outputPath, target, isProd, tsConfig }))

// this really helps hmr speed
const optimizeSplit = {
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
}

const optimization = {
  prod: {
    ...optimizeSplit,
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          ecma: 8,
          // toplevel: true,
        },
        sourceMap: true,
        cache: true,
        parallel: true,
      }),
    ],
  },
  dev: {
    // removeAvailableModules: false,
    // removeEmptyChunks: false,
    namedModules: true,
    // ...optimizeSplit,
  },
}

console.log('buildNodeModules', buildNodeModules)

const alias = {
  // if you want to profile in production...
  // 'react-dom': 'react-dom/profiling',
  // 'schedule/tracking': 'schedule/tracking-profiling',
  '@babel/runtime': Path.resolve(cwd, 'node_modules', '@babel/runtime'),
  'core-js': Path.resolve(cwd, 'node_modules', 'core-js'),
  react: Path.resolve(cwd, 'node_modules', 'react'),
  'react-dom': Path.resolve(cwd, 'node_modules', 'react-dom'),
  'react-hot-loader': Path.resolve(cwd, 'node_modules', 'react-hot-loader'),
  lodash: Path.resolve(cwd, 'node_modules', 'lodash'),
}

// console.log('alias', alias)

const config = {
  target,
  mode,
  entry,
  optimization: process.env.NO_OPTIMIZE
    ? {
        ...optimizeSplit,
        minimize: false,
      }
    : optimization[isProd ? 'prod' : 'dev'],
  output: {
    path: outputPath,
    pathinfo: !isProd,
    filename: 'bundle.js',
    publicPath: '/',
    // fixes react-hmr bug, pending https://github.com/webpack/webpack/issues/6642
    globalObject: "(typeof self !== 'undefined' ? self : this)",
  },
  devServer: {
    historyApiFallback: true,
    hot: !isProd,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  // for a faster dev mode you can do:
  //   eval-source-map (causes errors to not show stack trace in react development...)
  //   cheap-source-map (no line numbers...)
  //   cheap-module-eval-source-map (no line numbers...)
  devtool: isProd ? 'source-map' : 'cheap-module-source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    // mainFields: isProd ? ['module', 'browser', 'main'] : ['browser', 'main'],
    // modules: [Path.join(entry, 'node_modules'), buildNodeModules],
    alias,
  },
  resolveLoader: {
    modules: [buildNodeModules],
  },
  module: {
    rules: [
      {
        test: /[wW]orker\.[jt]sx?$/,
        use: ['workerize-loader'],
        exclude: /node_modules/,
      },
      // ignore .node.js modules
      {
        test: /\.node.[jt]sx?/,
        use: 'ignore-loader',
      },
      {
        test: /\.[jt]sx?$/,
        use: ['thread-loader', 'babel-loader', 'react-hot-loader/webpack'],
        exclude: /node_modules/,
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
    ],
  },
  plugins: [
    tsConfigExists && new TsconfigPathsPlugin({ configFile: tsConfig }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.PROCESS_NAME': JSON.stringify(process.env.PROCESS_NAME || readPackage('name')),
    }),

    new webpack.IgnorePlugin(/electron-log/),

    new HtmlWebpackPlugin({
      favicon: 'public/favicon.png',
      template: 'index.html',
    }),

    !!process.env['ANALYZE_BUNDLE'] &&
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      }),

    !!process.env['ANALYZE_BUNDLE'] &&
      new DuplicatesPlugin({
        emitErrors: false,
        verbose: true,
      }),

    !isProd && new webpack.NamedModulesPlugin(),

    isProd && new DuplicatePackageCheckerPlugin(),

    isProd &&
      new PrepackPlugin({
        reactEnabled: true,
        compatibility: 'node-react',
        // avoid worker modules
        test: /^(?!.*worker\.[tj]sx?)$/i,
      }),
  ].filter(Boolean),
}

export default config
