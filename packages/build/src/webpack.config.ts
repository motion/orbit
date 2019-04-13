import * as LernaProject from '@lerna/project'
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import * as Fs from 'fs'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { DuplicatesPlugin } from 'inspectpack/plugin'
import * as Path from 'path'
// import ProfilingPlugin from 'webpack/lib/debug/ProfilingPlugin'
import PrepackPlugin from 'prepack-webpack-plugin'
import webpack from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

const WebpackNotifierPlugin = require('webpack-notifier')
const TerserPlugin = require('terser-webpack-plugin')
const RehypePrism = require('@mapbox/rehype-prism')
// const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')

const cwd = process.cwd()
// TODO: this doesn't seem to be the correct way to get the monorepo root.
const repoRoot = Path.join(cwd, '..', '..')

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

const buildNodeModules = [
  // <repo>/packages/build/node_modules
  Path.join(__dirname, '..', 'node_modules'),
  // <repo>/node_modules
  Path.join(__dirname, '..', '..', '..', 'node_modules'),
]

const getFlag = flag => {
  const matcher = new RegExp(`${flag} ([a-z0-9]+)`, 'i')
  const found = process.argv.join(' ').match(matcher)
  return (found && found.length >= 2 && found[1]) || null
}

const target = getFlag('--target') || 'electron-renderer'
const defines = {
  'process.platform': JSON.stringify('darwin'),
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
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 8,
          compress: true,
          keep_classnames: true,
          output: {
            comments: false,
            beautify: false,
          },
        },
      }),
    ],
  },
  dev: {
    noEmitOnErrors: true,
    removeAvailableModules: false,
    namedModules: true,
    // ...optimizeSplit,
  },
}

const alias = {
  // Uncomment lines below if you want to profile in production...
  // 'react-dom': 'react-dom/profiling',
  // 'schedule/tracking': 'schedule/tracking-profiling',
  'react-dom': mode === 'production' ? 'react-dom' : '@hot-loader/react-dom',
}

const babelrcOptions = {
  ...JSON.parse(Fs.readFileSync(Path.resolve(cwd, '.babelrc'), 'utf-8')),
  babelrc: false,
  // this caused some errors with HMR where gloss-displaynames wouldnt pick up changed view names
  // im presuming because it cached the output and gloss-displaynames needs a redo somehow
  cacheDirectory: false,
}

console.log('babelrcOptions', babelrcOptions)

async function makeConfig() {
  // get the list of paths to all monorepo packages to apply ts-loader too
  const packages = await LernaProject.getPackages(repoRoot)
  const tsEntries = packages.map(pkg => Path.join(pkg.location, 'src'))
  // console.log('tsEntries', tsEntries)

  const config = {
    target,
    mode,
    entry,
    externals:
      target === 'web'
        ? {
            electron: '{}',
          }
        : {},
    optimization: process.env.NO_OPTIMIZE
      ? {
          ...optimizeSplit,
          minimize: false,
        }
      : optimization[isProd ? 'prod' : 'dev'],
    output: {
      path: outputPath,
      pathinfo: isProd,
      filename: 'bundle.js',
      publicPath: '/',
      // fixes react-hmr bug, pending https://github.com/webpack/webpack/issues/6642
      globalObject: "(typeof self !== 'undefined' ? self : this)",
    },
    devServer: {
      stats: {
        warnings: false,
        colors: true,
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
      mainFields: isProd
        ? ['ts:main', 'module', 'browser', 'main']
        : ['ts:main', 'browser', 'main'],
      alias,
    },
    resolveLoader: {
      modules: buildNodeModules,
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
                experimentalWatchApi: true,
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
          test: /\.mdx$/,
          use: [
            'babel-loader',
            {
              loader: '@mdx-js/loader',
              options: {
                rehypePlugins: [RehypePrism],
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
      // new ErrorOverlayPlugin(),

      new WebpackNotifierPlugin(),

      new webpack.DefinePlugin(defines),

      new webpack.IgnorePlugin(/electron-log/),

      new ForkTsCheckerWebpackPlugin({
        useTypescriptIncrementalApi: true,
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
  return config
}

export default makeConfig
