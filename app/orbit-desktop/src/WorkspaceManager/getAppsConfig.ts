import { AppMetaDict } from '@o/apps-manager'
import { Logger } from '@o/logger'
import { AppMeta, CommandWsOptions } from '@o/models'
import { stringToIdentifier } from '@o/utils'
import { ensureDir, ensureSymlink, pathExists, readJSON, writeFile } from 'fs-extra'
import { join } from 'path'
import webpack from 'webpack'

import { getIsInMonorepo } from './getIsInMonorepo'
import { DLLReferenceDesc, makeWebpackConfig, WebpackParams } from './makeWebpackConfig'
import { webpackPromise } from './webpackPromise'

const log = new Logger('getAppsConfig')

/**
 * This returns the configuration object for everything:
 *   1. a base.dll.js that includes the big shared libraries
 *   2. each app as it's own dll
 *   3. the workspaceEntry which imports app DLLs and concats them
 *   3. the "main" entry point with orbit-app
 */

export async function getAppsConfig(
  apps: AppMeta[],
  options: CommandWsOptions,
): Promise<{
  webpackConfigs: { [name: string]: webpack.Configuration }
  nameToAppMeta: AppMetaDict
} | null> {
  if (!apps.length) {
    return null
  }

  const isInMonoRepo = await getIsInMonorepo()
  const mode = options.dev ? 'development' : 'production'
  const directory = options.workspaceRoot
  const outputDir = join(directory, 'dist')
  const watch = !options.build // watch mode by default (if not building)

  log.info(`dev ${options.dev} watch ${watch} ${directory}, apps ${apps.length}`, options)

  // link local apps into local node_modules
  await ensureDir(join(directory, 'node_modules'))
  await Promise.all(
    apps
      .filter(x => x.isLocal)
      .map(async app => {
        const where = join(
          directory,
          // FOR NOW lets link into monorepo root if need be
          // need to figure out how to control dlls a bit better
          ...(isInMonoRepo ? ['..', '..'] : []),
          'node_modules',
          ...app.packageId.split('/'),
        )
        log.info(`Ensuring symlink from ${app.directory} to ${where}`)
        await ensureSymlink(app.directory, where)
      }),
  )

  let dllReferences: DLLReferenceDesc[] = []

  /**
   * Webpack fails to handle DLLs properly on first build, you can't put them all into
   * one config. You need to build them once before running the dllReference (main) app.
   * This inline function just ensures we build + reference them.
   */
  async function addDLL(params: WebpackParams): Promise<webpack.Configuration> {
    // add to dlls
    dllReferences.unshift({
      manifest: params.dll,
      filepath: join(params.outputDir || outputDir, params.outputFile),
    })
    // ensure built
    if (options.clean || !(await pathExists(params.dll))) {
      log.info(`Ensuring config built once: ${params.name}`, params.dll)
      const buildOnceConfig = await makeWebpackConfig({
        ...params,
        hot: true,
        watch: false,
      })
      await webpackPromise([buildOnceConfig], { loud: true })
    }
    return await makeWebpackConfig({
      ...params,
      hot: true,
      watch,
    })
  }

  const webpackConfigs: { [key: string]: webpack.Configuration } = {}

  // add base dll config
  const baseDllParams = await getBaseDllParams(directory)
  if (isInMonoRepo) {
    baseDllParams.mode = mode
    baseDllParams.watch = watch
    webpackConfigs.base = await addDLL(baseDllParams)
  }

  const nameToAppMeta: AppMetaDict = {}

  // add app dll configs
  const appParams: WebpackParams[] = await Promise.all(
    apps.map(async app => {
      const cleanName = stringToIdentifier(app.packageId)
      nameToAppMeta[cleanName] = app
      const dllFile = join(outputDir, `manifest-${cleanName}.json`)
      const appEntry = join(
        app.directory,
        (await readJSON(join(app.directory, 'package.json'))).main,
      )
      const params: WebpackParams = {
        name: `app_${cleanName}`,
        entry: [appEntry],
        context: directory,
        mode,
        target: 'web',
        publicPath: '/',
        outputFile: `${cleanName}.dll.js`,
        outputDir,
        injectHot: true,
        output: {
          library: cleanName,
        },
        dll: dllFile,
        // apps use the base dll
        dllReferences: [
          {
            manifest: baseDllParams.dll,
            filepath: join(outputDir, baseDllParams.outputFile),
          },
        ],
      }
      return params
    }),
  )
  await Promise.all(
    appParams.map(async params => {
      const config = await addDLL(getAppParams(params))
      webpackConfigs[params.name] = config
    }),
  )

  /**
   * Only needed when developing orbit itself.
   * Lets us develop on the main orbit bundle at the same time.
   */
  if (isInMonoRepo) {
    let entry = ''
    let extraConfig
    // main entry for orbit-app
    const monoRoot = join(__dirname, '..', '..', '..', '..')
    const appEntry = join(monoRoot, 'app', 'orbit-app', 'src', 'main')
    entry = appEntry
    const extraConfFile = join(appEntry, '..', '..', 'webpack.config.js')
    if (await pathExists(extraConfFile)) {
      extraConfig = require(extraConfFile)
    }
    /**
     * Allows for our orbit app to define some extra configuration
     * Could be used similarly in the future, if wanted, for apps too.
     */
    let extraMainConfig = null

    if (extraConfig) {
      const { main, ...others } = extraConfig
      extraMainConfig = main
      for (const name in others) {
        webpackConfigs[name] = await makeWebpackConfig(
          {
            mode,
            name,
            outputFile: `${name}.js`,
            outputDir,
            context: directory,
            ignore: ['electron-log', 'configstore'],
            target: 'web',
            hot: true,
            watch,
          },
          extraConfig[name],
        )
        log.info(`extra entry: ${name}`)
      }
    }
    // main bundle
    webpackConfigs.main = await makeWebpackConfig(
      {
        name: 'main',
        outputFile: 'main.js',
        outputDir,
        mode,
        context: directory,
        entry: [entry],
        ignore: ['electron-log', 'configstore', '@o/worker-kit'],
        target: 'web',
        watch,
        hot: true,
        dllReferences,
      },
      extraMainConfig,
    )
  }

  /**
   * Create the apps import
   */
  const appDefinitionsSrc = `// all apps
export default function getApps() {
  return [${apps.map(app => `require('${app.packageId}')`).join(',')}]
}`
  // const appDefsFile = join(entry, '..', '..', 'appDefinitions.js')
  const workspaceEntry = join(directory, 'dist', 'workspace-entry.js')
  log.info(`workspaceEntry ${workspaceEntry}`)
  await writeFile(workspaceEntry, appDefinitionsSrc)

  /**
   * Workspace config, this hopefully gives us some more control/ease with managing hmr/apps.
   * Having this ordered *last* is important, though we should fix it in useWebpackMiddleware
   */
  webpackConfigs.workspace = await makeWebpackConfig({
    name: 'workspaceEntry',
    outputFile: 'workspaceEntry.js',
    outputDir,
    mode,
    context: directory,
    entry: [workspaceEntry],
    target: 'web',
    watch,
    hot: false,
    dllReferences,
    output: {
      library: `window['__orbit_workspace']`,
      libraryTarget: 'assign',
      libraryExport: 'default',
    },
  })

  return {
    webpackConfigs,
    nameToAppMeta,
  }
}

export function getAppParams(props: WebpackParams): WebpackParams {
  if (!props.entry.length) {
    log.info(`No entries for ${props.name}`)
    return null
  }
  return {
    mode: 'development',
    publicPath: '/',
    externals: {
      typeorm: 'typeorm',
    },
    ignore: ['electron-log', '@o/worker-kit', 'configstore'],
    ...props,
    output: {
      library: '[name]',
      libraryTarget: 'umd',
      ...props.output,
    },
  }
}

export async function getBaseDllParams(directory: string): Promise<WebpackParams> {
  const outputDir = join(directory, 'dist')
  const basePackages = [
    '@o/kit',
    '@o/ui',
    '@o/utils',
    '@o/bridge',
    '@o/logger',
    '@o/config',
    '@o/models',
    '@o/stores',
    '@o/libs',
    '@o/css',
    '@o/color',
    '@o/automagical',
    '@o/use-store',
    '@babel/runtime',
    'node-libs-browser',
    'react-hot-loader',
    'react',
    'react-dom',
  ]

  // gather all packages we want included in base dll
  // i had to add this at one point because webpack stopped providing
  // the sub-packages of @o/ui and @o/kit, not sure why that happened
  let allPackages = [...basePackages]
  for (const pkg of basePackages) {
    const path = require.resolve(`${pkg}/package.json`)
    const pkgJson = await readJSON(path)
    const deps = [
      ...Object.keys(pkgJson.dependencies || {}),
      ...Object.keys(pkgJson.peerDependencies || {}),
    ]
    allPackages = [...allPackages, ...deps]
  }
  // ignore electron things
  // TODO make this a bit more... viable
  allPackages = allPackages.filter(
    x =>
      x !== 'electron-log' &&
      x !== 'configstore' &&
      x !== 'react-use' &&
      x !== '@babel/runtime' &&
      x !== 'typeorm',
  )

  // base dll with shared libraries
  return {
    name: `base`,
    injectHot: join(require.resolve('@o/kit'), '..', '..', 'src', 'index.ts'),
    entry: [...new Set(allPackages)],
    ignore: ['electron-log', 'configstore', 'typeorm'],
    context: directory,
    mode: 'development',
    watch: false,
    target: 'web',
    publicPath: '/',
    outputFile: 'base.dll.js',
    outputDir,
    output: {
      library: 'base',
    },
    dll: join(outputDir, 'manifest-base.json'),
  }
}
