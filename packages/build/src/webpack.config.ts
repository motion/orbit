import * as LernaProject from '@lerna/project'
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin'
import * as Fs from 'fs'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { DuplicatesPlugin } from 'inspectpack/plugin'
import * as Path from 'path'
import webpack from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

// import ProfilingPlugin from 'webpack/lib/debug/ProfilingPlugin'
const HtmlCriticalWebpackPlugin = require('html-critical-webpack-plugin')
const safePostCssParser = require('postcss-safe-parser')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
// const Critters = require('critters-webpack-plugin')
// const PreloadWebpackPlugin = require('preload-webpack-plugin')
// const WebpackNotifierPlugin = require('webpack-notifier')
const TerserPlugin = require('terser-webpack-plugin')
// const RehypePrism = require('@mapbox/rehype-prism')
// const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')
// const { PrepackPlugin } = require('prepack-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

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

const getFlag = flag => {
  const matcher = new RegExp(`${flag} ([^ ]+)`, 'i')
  const found = process.argv.join(' ').match(matcher)
  return (found && found.length >= 2 && found[1]) || null
}

const flags = {
  prod: getFlag('--prod'),
  disableHMR: getFlag('--disable-hmr'),
  entry: getFlag('--entry'),
  target: getFlag('--target'),
  devtool: getFlag('--devtool'),
}

if (flags.prod) {
  process.env.NODE_ENV = 'production'
}

const mode = process.env.NODE_ENV || 'development'
const isProd = mode === 'production'
const entry = process.env.ENTRY || flags.entry || readPackage('main') || './src/index.ts'

//   eval-source-map (causes errors to not show stack trace in react development...)
//   cheap-source-map (no line numbers...)
//   cheap-module-eval-source-map (seems alright in both...)
//   cheap-module-source-map (works well in electron, no line numbers in browser...)
const devtool = flags.devtool || isProd ? 'source-map' : 'cheap-module-eval-source-map'

// const appSrc = Path.join(entry, '..')
const tsConfig = Path.join(cwd, 'tsconfig.json')
const outputPath = Path.join(cwd, 'dist')

const buildNodeModules = [
  // <repo>/packages/build/node_modules
  Path.join(__dirname, '..', 'node_modules'),
  // <repo>/node_modules
  Path.join(__dirname, '..', '..', '..', 'node_modules'),
]

const target = flags.target || 'electron-renderer'
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
  'NO_OPTIMIZE = ',
  process.env.NO_OPTIMIZE,
  JSON.stringify({ entry, outputPath, target, isProd, tsConfig, defines }, null, 2),
)

const optimization = {
  prod: {
    usedExports: true,
    sideEffects: true,
    runtimeChunk: true,
    splitChunks: {
      chunks: 'async',
      name: false,
    },
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
        cache: true,
        parallel: true,
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
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: {
            inline: false,
            annotation: true,
          },
        },
      }),
    ].filter(Boolean),
  },
  dev: {
    noEmitOnErrors: true,
    removeAvailableModules: false,
    namedModules: true,
  },
}

const alias = {
  // Uncomment lines below if you want to profile in production...
  // 'react-dom': 'react-dom/profiling',
  // 'schedule/tracking': 'schedule/tracking-profiling',
  'react-dom': mode === 'production' ? 'react-dom' : '@hot-loader/react-dom',
  lodash: 'lodash',
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
      stats: {
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
      hot: !flags.disableHMR && !isProd,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    devtool,
    resolve: {
      extensions: ['.wasm', '.mjs', '.js', '.jsx', '.ts', '.tsx'],
      mainFields: isProd
        ? ['ts:main', 'module', 'browser', 'main']
        : ['ts:main', 'module', 'browser', 'main'],
      alias,
      // plugins: [new ModuleScopePlugin(appSrc, [appPackageJson])],
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
                configFile: tsConfig,
                happyPackMode: true,
                transpileOnly: true, // disable - we use it in fork plugin
                experimentalWatchApi: true,
              },
            },
            {
              loader: 'babel-loader',
              options: babelrcOptions,
            },
            !isProd && !flags.disableHMR && 'react-hot-loader/webpack',
          ].filter(Boolean),
        },
        {
          test: /\.css$/,
          use: [
            isProd && {
              loader: MiniCssExtractPlugin.loader,
            },
            !isProd && {
              loader: 'style-loader',
            },
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
            'babel-loader',
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
      new webpack.DefinePlugin(defines),

      new webpack.IgnorePlugin(/electron-log/),

      !isProd &&
        new ForkTsCheckerWebpackPlugin({
          useTypescriptIncrementalApi: true,
        }),

      new HtmlWebpackPlugin({
        favicon: 'public/favicon.png',
        template: 'public/index.html',
        chunksSortMode: 'none',
        ...(isProd && {
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

      // WARNING: this may or may not work wiht code splitting
      // i was seeing all the chunks loaded inline in HTML, when it shouldn't have
      // new PreloadWebpackPlugin({
      //   rel: 'preload',
      // }),

      isProd && new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),

      isProd &&
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash:8].css',
          chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        }),

      isProd &&
        target === 'web' &&
        new HtmlCriticalWebpackPlugin({
          base: outputPath,
          src: 'index.html',
          dest: 'index.html',
          inline: true,
          minify: true,
          extract: true,
          width: 375,
          height: 565,
          penthouse: {
            blockJSRequests: false,
          },
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

      // !process.env['ANALYZE_BUNDLE'] &&
      //   isProd &&
      //   new PrepackPlugin({
      //     reactEnabled: true,
      //     compatibility: 'node-react',
      //     // avoid worker modules
      //     test: /^(?!.*worker\.[tj]sx?)$/i,
      //   }),
    ].filter(Boolean),
  }
  return config
}

export default makeConfig
