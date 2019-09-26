import { selectDefined } from '@o/utils'
import ReactRefreshPlugin from '@o/webpack-fast-refresh'
import { pathExistsSync, readJSONSync } from 'fs-extra'
import IgnoreNotFoundExportPlugin from 'ignore-not-found-export-webpack-plugin'
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
  output?: webpack.Configuration['output']
  externals?: any
  ignore?: string[]
  watch?: boolean
  dll?: string
  dllReferences?: DLLReferenceDesc[]
  injectHot?: boolean | string
  hot?: boolean
  minify?: boolean
  devtool?: webpack.Configuration['devtool']
  plugins?: webpack.Configuration['plugins']
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
    devtool,
    injectHot,
    plugins,
  } = params

  // optimize react
  // process.env.OPTIMIZE_REACT = mode === 'development' ? undefined : 'true'

  // entry dir is the path above the entry file, this could be better...
  // const entryDir = Path.join(params.entry[0], '..')
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
      splitChunks: false,
      // much smaller bundles
      ...(target === 'node' && {
        sideEffects: true,
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
  const cliPath = Path.join(require.resolve('orbit'), '..', '..', 'node_modules')
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

  const hotEntry = `webpack-hot-middleware/client?name=${name}&path=/__webpack_hmr_${name}`
  const main = hot && !injectHot ? [hotEntry, ...entry] : entry

  const babelPresetMotion = [
    require.resolve('@o/babel-preset-motion'),
    {
      // even in prod ensure react-refresh is there
      enable: target === 'web' ? ['react-refresh/babel'] : [],
      disable: target !== 'web' ? ['react-refresh/babel'] : [],
      mode,
    },
  ]

  let config: webpack.Configuration = {
    cache: { type: 'filesystem' },
    name,
    watch,
    watchOptions: {
      // wait a lot longer before rebuilding node
      aggregateTimeout: target === 'node' ? 1500 : 30,
    },
    context,
    target,
    mode,
    entry: main,
    optimization: optimization[mode],
    output: {
      path: outputDir,
      pathinfo: true,
      filename: outputFile || '[name].js',
      ...output,
      publicPath,
      // fixes react-hmr bug, pending
      // https://github.com/webpack/webpack/issues/6642
      globalObject: "(typeof self !== 'undefined' ? self : this)",
    },
    devtool: selectDefined(
      devtool,
      mode === 'production' || target === 'node' ? 'source-map' : 'cheap-module-source-map',
    ),
    externals: [
      // having this on in development mode for node made exports fail
      target === 'web' && {
        electron: '{}',
      },
      externals,
    ].filter(Boolean),
    resolve: {
      extensions: ['.wasm', '.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
      mainFields:
        target === 'node'
          ? ['main']
          : mode === 'production'
          ? ['ts:main', 'module', 'browser', 'main']
          : ['ts:main', 'module', 'browser', 'main'],
      alias: {
        // we insert a "dynamic" react to toggle at runtime between dev/prod
        ...(!process.env['PLAIN_REACT'] && {
          react: '@o/react',
          'react-dom': '@o/react-dom',
        }),
        'react-native': 'react-native-web',
      },
      modules,
    },
    resolveLoader: {
      modules: buildNodeModules,
    },
    module: {
      rules: [
        {
          // these first loaders "short-circuit", so the rest wont load if one matches
          oneOf: [
            // fixed graphql errors https://github.com/graphql/graphiql/issues/617
            { test: /\.flow$/, loader: 'ignore-loader' },

            target !== 'node' && {
              test: /.worker\.[jt]sx?$/,
              use: [
                'workerize-loader',
                {
                  loader: 'babel-loader',
                  options: {
                    presets: [babelPresetMotion],
                  },
                },
              ],
              exclude: /node_modules/,
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
                if (ignore.some(z => z.indexOf(x) > -1)) {
                  return true
                }
                return false
              },
            },

            // ignore non-.node.js modules in node mode
            // target === 'node' && {
            //   test: path => {
            //     // dont ignore if is entry file
            //     if (path === entry[0]) {
            //       return false
            //     }
            //     // dont ignore if outside of this app source
            //     if (path.indexOf(entryDir) !== 0) {
            //       return false
            //     }
            //     // ignore if inside this apps src, and not matching our .node pattern (or entry):
            //     const isValidNodeFile = entry === path || path.indexOf('.node.ts') > -1
            //     return !isValidNodeFile
            //   },
            //   use: 'ignore-loader',
            // },

            // ignore .electron.js modules if in web mode
            target !== 'electron-renderer' && {
              test: /\.electron.[jt]sx?/,
              use: 'ignore-loader',
            },

            // if doesnt match one of the above, fallback to the regular loaders
            {
              rules: [
                injectHot &&
                  (() => {
                    return {
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
                          // prefix, OrbitHot captures the app you create with createApp()
                          prefix: `
require('@o/kit').OrbitHot.fileEnter({
  name: '${name}',
  __webpack_require__: __webpack_require__,
  module,
});
`,
                          // postfix clears the createApp hot handler
                          postfix: `
require('@o/kit').OrbitHot.fileLeave();
`,
                        },
                      },
                    }
                  })(),
                {
                  test: /\.tsx?$/,
                  use: [
                    'thread-loader',
                    {
                      loader: 'babel-loader',
                      options: {
                        presets: [babelPresetMotion],
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
                  use: ['file-loader'],
                },
                {
                  test: /\.(md)$/,
                  use: 'raw-loader',
                },
              ].filter(Boolean),
            },
          ].filter(Boolean),
        },
      ].filter(Boolean),
    },
    plugins: [
      ...(plugins || []),

      new IgnoreNotFoundExportPlugin(),

      // new HardSourceWebpackPlugin({
      //   // cacheDirectory: '.cache/hard-source/[confighash]',
      //   environmentHash: {
      //     root: process.cwd(),
      //     version: require('../../package.json').version,
      //     mode,
      //     ...process.env,
      //   },
      //   info: {
      //     mode: 'none',
      //     level: 'error', // warn to debug if its slow
      //   },
      //   cachePrune: {
      //     maxAge: 10 * 24 * 60 * 60 * 1000,
      //     sizeThreshold: 50 * 1024 * 1024,
      //   },
      // }),

      new TimeFixPlugin(),

      new webpack.DefinePlugin(defines),

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

      target === 'web' &&
        !!(hot || injectHot) &&
        (() => {
          // console.log('apply react refresh', entry)
          return new ReactRefreshPlugin()
        })(),

      !!(hot || injectHot) &&
        new webpack.HotModuleReplacementPlugin({
          // multiStep is faster for app HMR but slower when developing the big bundles
          // multiStep: mode !== 'production',
        }),

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
