import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import * as Fs from 'fs'
import { readJSONSync } from 'fs-extra'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { DuplicatesPlugin } from 'inspectpack/plugin'
import * as Path from 'path'
// import ProfilingPlugin from 'webpack/lib/debug/ProfilingPlugin'
import PrepackPlugin from 'prepack-webpack-plugin'
import webpack from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
const TerserPlugin = require('terser-webpack-plugin')
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')

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
const outputPath = Path.join(cwd, 'dist')
const buildNodeModules = process.env.WEBPACK_MODULES || Path.join(__dirname, '..', 'node_modules')

const getFlag = flag => {
  const matcher = new RegExp(`${flag} ([a-z0-9]+)`, 'i')
  const found = process.argv.join(' ').match(matcher)
  return (found && found.length >= 2 && found[1]) || null
}

const target = getFlag('--target') || 'electron-renderer'
const defines = {
  'process.env.NODE_ENV': JSON.stringify(mode),
  'process.env.RENDER_TARGET': JSON.stringify(target),
  'process.env.PROCESS_NAME': JSON.stringify(process.env.PROCESS_NAME || readPackage('name')),
  'process.env.DISABLE_SYNCERS': JSON.stringify(process.env.DISABLE_SYNCERS || false),
  'process.env.DISABLE_LOGGING': JSON.stringify(process.env.DISABLE_LOGGING || false),
}

console.log(
  'webpack info',
  JSON.stringify({ outputPath, target, isProd, tsConfig, defines }, null, 2),
)

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
  },
  dev: {
    noEmitOnErrors: true,
    removeAvailableModules: false,
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
  // 'react-dom': Path.resolve(cwd, 'node_modules', 'react-dom'),
  'react-dom': Path.resolve(buildNodeModules, '@hot-loader/react-dom'),
  'react-hot-loader': Path.resolve(cwd, 'node_modules', 'react-hot-loader'),
  lodash: Path.resolve(cwd, 'node_modules', 'lodash'),
}

let tsEntries = [Path.resolve(cwd, 'src')]
const packageJSON = readJSONSync(Path.join(cwd, 'package.json'))
if (packageJSON.tsEntries) {
  tsEntries = [
    ...tsEntries,
    ...packageJSON.tsEntries.map(moduleName => {
      return Fs.realpathSync(Path.resolve(cwd, 'node_modules', moduleName, 'src'))
    }),
  ]
}

console.log('tsEntries', tsEntries)

const babelrcOptions = {
  ...JSON.parse(Fs.readFileSync(Path.resolve(cwd, '.babelrc'), 'utf-8')),
  babelrc: false,
  // this caused some errors with HMR where gloss-displaynames wouldnt pick up changed view names
  // im presuming because it cached the output and gloss-displaynames needs a redo somehow
  cacheDirectory: true,
}

console.log('babelrcOptions', babelrcOptions)

const tsmain = packageJSON.tsEntries ? ['ts:main'] : []

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
    stats: {
      warnings: false,
    },
    historyApiFallback: true,
    hot: !isProd,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  // for a faster dev mode you can do:
  //   eval-source-map (causes errors to not show stack trace in react development...)
  //   cheap-source-map (no line numbers...)
  //   cheap-module-eval-source-map (seems alright in both...)
  //   cheap-module-source-map (works well in electron, no line numbers in browser...)
  devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    mainFields: isProd ? [...tsmain, 'module', 'browser', 'main'] : [...tsmain, 'browser', 'main'],
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
        include: tsEntries,
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

    target === 'web' && new webpack.IgnorePlugin(/^electron$/),

    new ForkTsCheckerWebpackPlugin(),

    isProd &&
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 6,
        },
      }),

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
