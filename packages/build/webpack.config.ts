// @ts-ignore
import webpack from 'webpack'
import * as Path from 'path'
import * as Fs from 'fs'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
// import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
// import ProfilingPlugin from 'webpack/lib/debug/ProfilingPlugin'

const cwd = process.cwd()
const readEntry = () => {
  try {
    console.log('ok', Path.join(cwd, 'package.json'))
    const packageJson = Fs.readFileSync(Path.join(cwd, 'package.json'))
    const pkg = JSON.parse(packageJson.toString())
    return pkg.main
  } catch {
    return null
  }
}

const mode = process.env.NODE_ENV || 'development'
const isProd = mode === 'production'
const entry = process.env.ENTRY || readEntry() || './src'
const tsConfig = Path.join(cwd, 'tsconfig.json')
console.log('using tsConfig', tsConfig)
const tsConfigExists = Fs.existsSync(tsConfig)
const outputPath = Path.join(cwd, 'dist')
const buildNodeModules =
  process.env.WEBPACK_MODULES || Path.join(__dirname, '..', 'node_modules')

const getFlag = flag => {
  const matcher = new RegExp(`${flag} ([a-z0-9]+)`, 'i')
  const found = process.argv.join(' ').match(matcher)
  return (found && found.length >= 2 && found[1]) || null
}

const target = getFlag('--target') || 'web'

console.log('outputting to', outputPath)
console.log('target', target)
console.log('isProd', isProd)
console.log('tsConfig', tsConfig)

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
          toplevel: true,
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
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  // inline source map allows chrome remote debugger to access it
  // see: https://stackoverflow.com/questions/27671390/why-inline-source-maps
  devtool: isProd ? 'cheap-module-source-map' : 'inline-source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    mainFields: isProd ? ['module', 'browser', 'main'] : ['browser', 'main'],
    // modules: [Path.join(entry, 'node_modules'), buildNodeModules],
    alias: {
      '@babel/runtime': Path.resolve(cwd, 'node_modules', '@babel/runtime'),
      'core-js': Path.resolve(cwd, 'node_modules', 'core-js'),
    },
  },
  resolveLoader: {
    modules: [buildNodeModules],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: ['cache-loader', 'thread-loader', 'babel-loader'],
        exclude: ['node_modules'],
      },
      // {
      //   test: /\.tsx?$/,
      //   use: [
      //     'cache-loader',
      //     'babel-loader',
      //     {
      //       loader: 'thread-loader',
      //       options: {
      //         // there should be 1 cpu for the fork-ts-checker-webpack-plugin
      //         workers: require('os').cpus().length,
      //       },
      //     },
      //     {
      //       loader: 'ts-loader',
      //       options: {
      //         // speed-up compilation and reduce errors reported to webpack
      //         happyPackMode: true,
      //         // no checking of types in webpack in dev, just use your IDE
      //         transpileOnly: !isProd,
      //         experimentalWatchApi: true,
      //       },
      //     },
      //   ],
      //   exclude: ['node_modules'],
      // },
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
    // this runs a checker in a process, but reduces the number of processes that run
    // new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: !isProd }),
    tsConfigExists && new TsconfigPathsPlugin({ configFile: tsConfig }),
    new DuplicatePackageCheckerPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode),
    }),
    // adds cache based on source of files
    new HardSourceWebpackPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      favicon: 'public/favicon.png',
      template: 'index.html',
    }),
    process.argv.indexOf('--report') > 0 &&
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      }),
  ].filter(Boolean),
}

export default config
