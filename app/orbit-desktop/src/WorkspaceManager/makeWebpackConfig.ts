import AddAssetHtmlPlugin from 'add-asset-html-webpack-plugin'
import { pathExistsSync, readJSONSync } from 'fs-extra'
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import * as Path from 'path'
import TerserPlugin from 'terser-webpack-plugin'
import TimeFixPlugin from 'time-fix-plugin'
import webpack from 'webpack'
import merge from 'webpack-merge'

export type DLLReferenceDesc = { manifest: string; filepath: string }

export type WebpackParams = {
  name?: string
  entry?: string[]
  context: string
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
  dllReferences?: DLLReferenceDesc[]
  injectHot?: boolean | string
  hot?: boolean
  minify?: boolean
  noChunking?: boolean
}

export function makeWebpackConfig(
  params: WebpackParams,
  ...extraConfigs: webpack.Configuration[]
): webpack.Configuration {
  let {
    outputFile,
    entry = [],
    publicPath = '/',
    context,
    mode = 'development' as any,
    output,
    outputDir = Path.join(context, 'dist'),
    externals,
    ignore = [],
    watch = false,
    // why minify? we arent optimizing for size much and it dramatically raises cost of build
    // + way harder to debug in general, lets leave it off until someone yells about it
    minify = false,
    dll,
    dllReferences,
    hot,
    name,
    noChunking,
    injectHot,
  } = params

  // entry dir is the path above the entry file, this could be better...
  const entryDir = Path.join(params.entry[0], '..')
  const target = params.target || 'electron-renderer'
  const hasDLLReferences = !!(dllReferences && dllReferences.length)

  // TODO isnt set for production
  const repoEntry = require.resolve('@o/orbit-desktop')
  const repoRoot = Path.join(repoEntry, '..', '..')
  const buildNodeModules = [
    Path.join(repoRoot, 'node_modules'),
    // TODO we can pass in process.env.IS_IN_MONO_REPO
    Path.join(repoRoot, '..', '..', 'node_modules'),
  ]

  const defines = {
    'process.platform': JSON.stringify('darwin'),
    'process.env.NODE_ENV': JSON.stringify(mode),
  }

  const optimization = {
    production: {
      minimize: minify,
      namedModules: true,
      usedExports: true,
      providedExports: true,
      // YO turning this on messes up the dll/dllreference
      // what we could do likely is turn this on just for the main bundle
      // but also were an app platform, we dont care about file size so much for now
      sideEffects: false,
      concatenateModules: true,
      // this helps runtime/loadtime
      splitChunks: {
        chunks: 'async',
        name: false,
      },
      ...((target === 'node' || noChunking) && {
        splitChunks: false,
      }),
    },
    development: {
      minimize: minify,
      noEmitOnErrors: true,
      removeAvailableModules: false,
      concatenateModules: false,
      namedModules: true,
      namedChunks: true,
      splitChunks: false,
      // node can't keep around a ton of cruft to parse, but in web dev mode need hmr speed
      // so optimize away side effects in node
      ...(target === 'node' && {
        removeAvailableModules: true,
        sideEffects: true,
        providedExports: true,
        usedExports: true,
      }),
    },
  }

  // include the cli node modules as backup
  const cliPath = Path.join(require.resolve('@o/cli'), '..', '..', 'node_modules')
  let modules = ['node_modules', cliPath]

  // if in monorepo add monorepo hoisted modules
  try {
    const monoRepoModules = Path.join(cliPath, '..', '..', '..')
    const monoRepoPackageJson = Path.join(monoRepoModules, 'package.json')
    const isInMonoRepo =
      pathExistsSync(monoRepoPackageJson) &&
      readJSONSync(monoRepoPackageJson).name === 'orbit-monorepo'
    if (isInMonoRepo) {
      modules = [...modules, Path.join(monoRepoModules, 'node_modules')]
    }
  } catch (err) {
    console.log('err testing monorepo', err)
  }

  let config: webpack.Configuration = {
    name,
    watch,
    context,
    target,
    mode,
    entry,
    optimization: optimization[mode],
    output: {
      path: outputDir,
      pathinfo: mode === 'development',
      filename: outputFile || '[name].js',
      ...output,
      publicPath,
      // fixes react-hmr bug, pending
      // https://github.com/webpack/webpack/issues/6642
      globalObject: "(typeof self !== 'undefined' ? self : this)",
    },
    devtool: mode === 'production' || target === 'node' ? 'source-map' : 'cheap-source-map',
    externals: [
      {
        electron: '{}',
      },
      externals,
    ].filter(Boolean),
    resolve: {
      extensions: ['.wasm', '.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
      mainFields:
        mode === 'production'
          ? ['ts:main', 'module', 'browser', 'main']
          : ['ts:main', 'module', 'browser', 'main'],
      alias: {
        // disable until fixed bug in rhl
        'react-dom': mode === 'production' ? 'react-dom' : '@hot-loader/react-dom',
        'react-native': 'react-native-web',
      },
      modules,
    },
    resolveLoader: {
      modules: buildNodeModules,
    },
    module: {
      rules: [
        // fixed graphql errors https://github.com/graphql/graphiql/issues/617
        { test: /\.flow$/, loader: 'ignore-loader' },
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
        !!ignore.length && {
          use: 'ignore-loader',
          test: x => {
            // explicit ignores from options
            if (ignore.find(z => z.indexOf(x) > -1)) {
              return true
            }
            return false
          },
        },
        // ignore non-.node.js modules in node mode
        target === 'node' && {
          test: x => {
            // dont ignore if is entry file
            if (x === entry[0]) {
              return false
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

        injectHot && {
          test: x => {
            if (typeof injectHot === 'string') {
              return x === injectHot
            }
            if (x === entry[0]) return true
            return false
          },
          use: {
            loader: `add-source-loader`,
            options: {
              postfix: `
require('@o/kit').createHotHandler({
  name: '${name}',
  getHash: __webpack_require__.h,
  module,
});
`,
            },
          },
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    require.resolve('@o/babel-preset-motion'),
                    {
                      disable: target === 'node' ? ['react-hot-loader/babel'] : [],
                    },
                  ],
                ],
              },
            },
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
      new HardSourceWebpackPlugin({
        cacheDirectory: 'node_modules/.cache/hard-source/[confighash]',
        environmentHash: {
          root: process.cwd(),
        },
        info: {
          mode: 'none',
          level: 'error', // warn to debug if its slow
        },
      }),

      new TimeFixPlugin(),

      new webpack.DefinePlugin(defines),

      !dll &&
        target !== 'node' &&
        new HtmlWebpackPlugin({
          template: Path.join(__dirname, '..', '..', 'index.html'),
          inject: true,
          externals: ['apps.js'],
        }),

      ((mode === 'production' && minify !== false) || minify === true) &&
        new TerserPlugin({
          sourceMap: true,
          parallel: true,
          cache: true,
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

      !!dll &&
        new webpack.DllPlugin({
          name:
            output.library ||
            (() => {
              throw new Error(`need output.library`)
            })(),
          path: dll,
          // @ts-ignore
          entryOnly: true,
        }),

      ...((hasDLLReferences &&
        dllReferences.map(
          ({ manifest }) =>
            new webpack.DllReferencePlugin({
              manifest,
              context,
            }),
        )) ||
        []),

      // inject dll references into index.html
      ...((hasDLLReferences &&
        dllReferences.map(
          ({ filepath }) =>
            new AddAssetHtmlPlugin({
              filepath,
            }),
        )) ||
        []),

      hot && new webpack.HotModuleReplacementPlugin(),

      // new (require('bundle-analyzer-plugin').default)({
      //   analyzerMode: 'static',
      // })

      // mode === 'development' && new webpack.NamedModulesPlugin(),
    ].filter(Boolean) as webpack.Plugin[],
  }

  if (extraConfigs.some(Boolean)) {
    config = merge.smart([config, ...extraConfigs])
  }

  return config
}
