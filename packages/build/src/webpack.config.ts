// @ts-ignore
import webpack from 'webpack'
import * as Path from 'path'
import * as Fs from 'fs'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
// import HardSourceWebpackPlugin from 'hard-source-webpack-plugin'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
// import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
// import ProfilingPlugin from 'webpack/lib/debug/ProfilingPlugin'
// import PrepackPlugin from 'prepack-webpack-plugin'

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
    // ...optimizeSplit,
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
    removeAvailableModules: false,
    removeEmptyChunks: false,
    namedModules: true,
    ...optimizeSplit,
  },
}

console.log('buildNodeModules', buildNodeModules)

const config = {
  target,
  mode,
  entry,
  optimization: optimization[isProd ? 'prod' : 'dev'],
  output: {
    path: outputPath,
    pathinfo: !isProd,
    filename: 'bundle.js',
    publicPath: '/',
    // fixes react-hmr bug, pending https://github.com/webpack/webpack/issues/6642
    globalObject: '(typeof self !== \'undefined\' ? self : this)',
  },
  devServer: {
    historyApiFallback: true,
    hot: !isProd,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  // inline source map allows chrome remote debugger to access it
  // see: https://stackoverflow.com/questions/27671390/why-inline-source-maps
  devtool: isProd ? 'cheap-module-source-map' : 'cheap-eval-source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    // mainFields: isProd ? ['module', 'browser', 'main'] : ['browser', 'main'],
    // modules: [Path.join(entry, 'node_modules'), buildNodeModules],
    alias: {
      // if you want to profile in production...
      // 'react-dom': 'react-dom/profiling',
      // 'schedule/tracking': 'schedule/tracking-profiling',
      '@babel/runtime': Path.resolve(cwd, 'node_modules', '@babel/runtime'),
      'core-js': Path.resolve(cwd, 'node_modules', 'core-js'),
      react: Path.resolve(cwd, 'node_modules', 'react'),
      'react-dom': Path.resolve(cwd, 'node_modules', 'react-dom'),
      'react-hot-loader': Path.resolve(cwd, 'node_modules', 'react-hot-loader'),
    },
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
      {
        test: /\.[jt]sx?$/,
        use: ['thread-loader', 'babel-loader'],
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
    // new ProfilingPlugin(),
    tsConfigExists && new TsconfigPathsPlugin({ configFile: tsConfig }),
    new DuplicatePackageCheckerPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.PROCESS_NAME': JSON.stringify(process.env.PROCESS_NAME || readPackage('name')),
    }),
    new webpack.IgnorePlugin(/electron-log/),
    // adds cache based on source of files
    // new HardSourceWebpackPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      favicon: 'public/favicon.png',
      template: 'index.html',
    }),
    process.argv.indexOf('--report') > 0 &&
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      }),

    // isProd && new PrepackPlugin(),
  ].filter(Boolean),
}

export default config
