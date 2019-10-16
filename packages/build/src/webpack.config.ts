import * as LernaProject from '@lerna/project'
import * as Fs from 'fs'
import { DuplicatesPlugin } from 'inspectpack/plugin'
import * as Path from 'path'
import webpack from 'webpack'

// require so it doesnt get removed on save
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')
const IgnoreNotFoundExportPlugin = require('ignore-not-found-export-webpack-plugin')
const ReactRefreshPlugin = require('@o/webpack-fast-refresh')
// reduced a 5mb bundle by 0.01mb...
const ShakePlugin = require('webpack-common-shake').Plugin
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { BundleStatsWebpackPlugin } = require('bundle-stats')

// const WebpackDeepScopeAnalysisPlugin = require('webpack-deep-scope-plugin').default
const GlossWebpackPlugin = require('@o/gloss-webpack')
const LodashWebpackPlugin = require('lodash-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// import ProfilingPlugin from 'webpack/lib/debug/ProfilingPlugin'
// const HtmlCriticalWebpackPlugin = require('html-critical-webpack-plugin')
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const WebpackNotifierPlugin = require('webpack-notifier')
// const TerserPlugin = require('terser-webpack-plugin')
// const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// const CircularDependencyPlugin = require('circular-dependency-plugin')

// for importing ui kit properly
process.env.RENDER_TARGET = 'node'
process.env.SPLIT_CHUNKS = 'true'

const cwd = process.cwd()
// TODO: this doesn't seem to be the correct way to get the monorepo root.
const repoRoot = Path.join(cwd, '..', '..')

const appPackageJson = Path.join(cwd, 'package.json')

const readPackage = (key: string) => {
  try {
    const packageJson = Fs.readFileSync(appPackageJson)
    const pkg = JSON.parse(packageJson.toString())
    return pkg[key]
  } catch {
    return null
  }
}

const getFlag = (flag, isBoolean = false) => {
  if (isBoolean) {
    return process.argv.some(x => x === flag)
  }
  const matcher = new RegExp(`${flag} ([^ ]+)`, 'i')
  const found = process.argv.join(' ').match(matcher)
  return (found && found.length >= 2 && found[1]) || null
}

const flags = {
  prod: getFlag('--prod', true),
  disableHMR: getFlag('--disable-hmr', true),
  entry: getFlag('--entry'),
  target: getFlag('--target'),
  devtool: getFlag('--devtool'),
  executable: getFlag('--executable', true),
  extractStaticStyles: getFlag('--extract-static-styles', true),
  extractCSS: getFlag('--extract-css', true),
  splitChunks: getFlag('--split-chunks', true),
}

if (flags.prod) {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production'
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n\n warning! prod build in dev mode ⚠️\n\n`)
  }
}

if (flags.disableHMR) {
  process.env.DISABLE_BABEL_PLUGIN = 'react-refresh/babel'
}

const mode = process.env.NODE_ENV || 'development'
const isProd = mode === 'production'
const entry = {
  main: process.env.ENTRY || flags.entry || readPackage('main') || './src/index.ts',
}

const NO_OPTIMIZE = process.env.NO_OPTIMIZE
const IS_RUNNING = process.env.IS_RUNNING

const target = flags.target || 'electron-renderer'
const shouldExtractCSS = target !== 'node' && (isProd || flags.extractCSS) && !IS_RUNNING

//   eval-source-map (causes errors to not show stack trace in react development...)
//   cheap-source-map (no line numbers...)
//   cheap-module-eval-source-map (seems alright in both...)
//   cheap-module-source-map (works well in electron, no line numbers in browser...)
const devtool = flags.devtool || (isProd ? 'source-map' : 'cheap-module-source-map')

// const appSrc = Path.join(entry, '..')
const tsConfig = Path.join(cwd, 'tsconfig.json')
// const tsConfigExists = pathExistsSync(tsConfig)
const outputPath = Path.join(cwd, 'dist')

const buildNodeModules = [
  // <repo>/packages/build/node_modules
  Path.join(__dirname, '..', 'node_modules'),
  // <repo>/node_modules
  Path.join(__dirname, '..', '..', '..', 'node_modules'),
]

const hot = !flags.disableHMR && !isProd
const defines = {
  'process.platform': JSON.stringify('darwin'),
  'process.env.NODE_ENV': JSON.stringify(mode),
  __DEV__: JSON.stringify(mode === 'development'),
  'process.env.RENDER_TARGET': JSON.stringify(target),
  'process.env.PROCESS_NAME': JSON.stringify(process.env.PROCESS_NAME || readPackage('name')),
  'process.env.DISABLE_WORKERS': JSON.stringify(process.env.DISABLE_WORKERS || false),
  'process.env.LOG_LEVEL': JSON.stringify(process.env.LOG_LEVEL || 'info'),
  'process.env.SPLIT_CHUNKS': JSON.stringify(process.env.SPLIT_CHUNKS),
}

console.log(
  'webpack info',
  (NO_OPTIMIZE && 'NO_OPTIMIZE!!') || '',
  JSON.stringify(
    { hot, devtool, buildNodeModules, entry, outputPath, target, isProd, tsConfig, defines },
    null,
    2,
  ),
)

const optimization = {
  prod: {
    nodeEnv: 'production',
    namedChunks: true,
    usedExports: true,
    sideEffects: true,
    minimize: true,
    concatenateModules: true,
    // minimizer: [
    //   new TerserPlugin({
    //     sourceMap: true,
    //     parallel: true,
    //     cache: true,
    //     terserOptions: {
    //       toplevel: false,
    //       module: true,
    //       parse: {
    //         ecma: 8,
    //       },
    //       compress: {
    //         ecma: 7,
    //         warnings: true,
    //       },
    //       mangle: {
    //         safari10: true,
    //       },
    //       keep_classnames: true,
    //       output: {
    //         ecma: 7,
    //         comments: false,
    //         beautify: false,
    //         ascii_only: true,
    //       },
    //     },
    //   }),
    // ],
    ...(target === 'node'
      ? {
          splitChunks: false,
        }
      : {
          // runtimeChunk: true,
          splitChunks: {
            chunks: 'all',
          },
        }),
  },
  dev: {
    noEmitOnErrors: true,
    removeAvailableModules: false,
    namedModules: true,
    usedExports: true,
    ...(flags.splitChunks && {
      splitChunks: {
        chunks: 'all',
      },
    }),
  },
}

const alias = {
  // Uncomment lines below if you want to profile in production...
  // 'react-dom': 'react-dom/profiling',
  // 'schedule/tracking': 'schedule/tracking-profiling',
  'lodash.isequal': 'lodash/isEqual',
  // prevent some obvious duplicates
  mobx: 'mobx',
  react: 'react',
  'react-dom': 'react-dom',
  'react-refresh': 'react-refresh',
  // path: false,
}

const babelpath = Path.resolve(cwd, '.babelrc')
const babelrcOptions = {
  ...JSON.parse(Fs.readFileSync(babelpath, 'utf-8')),
  // this caused some errors with HMR where gloss-displaynames wouldnt pick up changed view names
  // im presuming because it cached the output and gloss-displaynames needs a redo somehow
  compact: false,
  cacheDirectory: false,
}

console.log('babel', babelpath, babelrcOptions)

async function makeConfig() {
  // get the list of paths to all monorepo packages to apply ts-loader too
  const packages = await LernaProject.getPackages(repoRoot)
  const tsEntries = packages.map(pkg => Path.join(pkg.location, 'src'))
  // console.log('tsEntries', tsEntries)

  const config = {
    cache: false,
    watch: !!IS_RUNNING,
    target,
    mode,
    entry,
    externals:
      target === 'web'
        ? {
            electron: '{}',
          }
        : {},
    optimization: NO_OPTIMIZE
      ? {
          minimize: false,
        }
      : optimization[isProd ? 'prod' : 'dev'],
    output: {
      path: outputPath,
      publicPath: '/',
      // fixes react-hmr bug, pending https://github.com/webpack/webpack/issues/6642
      globalObject: "(typeof self !== 'undefined' ? self : this)",
      chunkFilename: isProd
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : 'static/js/[name].chunk.js',
    },
    devServer: {
      clientLogLevel: 'error',
      stats: isProd
        ? true
        : {
            hash: false,
            reasons: false,
            version: false,
            timings: false,
            assets: false,
            chunks: false,
            source: false,
            errors: true,
            errorDetails: false,
            warnings: false,
            colors: true,
          },
      historyApiFallback: true,
      hot,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    devtool,
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.jsx', '.wasm', '.mjs'],
      mainFields: ['ts:main', 'module', 'source', 'browser', 'main'],
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
          test: /\.(j|t)sx?$/,
          // in prod mode include everything for better bundling,
          // in dev mode just the entries in monorepo
          ...(isProd ? null : { include: tsEntries }),
          use: [
            {
              loader: 'babel-loader',
              options: babelrcOptions,
            },

            flags.extractStaticStyles && {
              loader: GlossWebpackPlugin.loader,
              options: require('@o/ui/glossLoaderConfig'),
            },
          ].filter(Boolean),
        },
        {
          test: /\.css$/,
          use: [
            shouldExtractCSS && {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: process.env.NODE_ENV === 'development',
              },
            },
            !shouldExtractCSS && 'style-loader',
            'css-loader',
          ].filter(Boolean),
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
          test: /\.mdx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                plugins: [],
                presets: ['@o/babel-preset-motion'],
              },
            },
            {
              loader: '@mdx-js/loader',
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
      new DuplicatePackageCheckerPlugin(),
      new LodashWebpackPlugin(),
      new IgnoreNotFoundExportPlugin(),
      new WebpackNotifierPlugin({ excludeWarnings: true }),
      new webpack.DefinePlugin(defines),
      flags.extractStaticStyles && new GlossWebpackPlugin(),

      target !== 'node' &&
        new webpack.IgnorePlugin({
          resourceRegExp: /^(electron-log)$/,
        }),

      mode === 'development' && hot && new webpack.HotModuleReplacementPlugin(),
      mode === 'development' && hot && new ReactRefreshPlugin(),

      !process.env['IGNORE_HTML'] &&
        target !== 'node' &&
        new HtmlWebpackPlugin({
          // chunksSortMode: 'manual',
          favicon: 'public/favicon.png',
          template: 'public/index.html',
          // inject: true,
          ...(isProd &&
            !NO_OPTIMIZE && {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }),
        }),

      // tsConfigExists &&
      //   !isProd &&
      //   new ForkTsCheckerWebpackPlugin({
      //     useTypescriptIncrementalApi: true,
      //   }),

      // target !== 'node' &&
      //   isProd &&
      //   new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),

      shouldExtractCSS && // dont extract css when running directly
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash:8].css',
          chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        }),

      // shouldExtractCSS &&
      //   target === 'web' &&
      //   new HtmlCriticalWebpackPlugin({
      //     base: outputPath,
      //     src: 'index.html',
      //     dest: 'index.html',
      //     inline: true,
      //     minify: true,
      //     extract: true,
      //     width: 375,
      //     height: 565,
      //     // penthouse: {
      //     //   blockJSRequests: false,
      //     // },
      //   }),

      !!process.env['ANALYZE_BUNDLE'] &&
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
        }),

      !!process.env['ANALYZE_BUNDLE'] &&
        new DuplicatesPlugin({
          emitErrors: false,
          verbose: true,
        }),

      // !!process.env['ANALYZE_BUNDLE'] && new WebpackVisualizerPlugin(),

      !!process.env['ANALYZE_BUNDLE'] &&
        new BundleStatsWebpackPlugin({
          outDir: outputPath,
          baseline: true,
          compare: false,
        }),

      // !isProd && new webpack.NamedModulesPlugin(),

      !!process.env['SHAKE_COMMONJS'] && new ShakePlugin(),

      // new CircularDependencyPlugin({
      //   // failOnError: true,
      // }),

      flags.executable &&
        new webpack.BannerPlugin({
          banner: '#!/usr/bin/env node',
          raw: true,
        }),
    ].filter(Boolean),
  }

  return config
}

export default makeConfig
