import { Logger } from '@o/logger'
import { AppMeta, CommandWsOptions } from '@o/models'
import { stringToIdentifier } from '@o/utils'
import { ensureDir, ensureSymlink, pathExists, readJSON } from 'fs-extra'
import { join } from 'path'
import webpack from 'webpack'

import { getAppEntry } from './commandBuild'
import { getIsInMonorepo } from './getIsInMonorepo'
import { DLLReferenceDesc, makeWebpackConfig, WebpackParams } from './makeWebpackConfig'
import { webpackPromise } from './webpackPromise'
import { AppBuildModeDict } from './WorkspaceManager'

const log = new Logger('getAppsConfig')

/**
 * This returns the configuration object for everything:
 *   1. a base.dll.js that includes the big shared libraries
 *   2. each app as it's own dll
 *   3. the "main" entry point with orbit-app
 */

export async function getAppsConfig(
  apps: AppMeta[],
  buildMode: AppBuildModeDict,
  options: CommandWsOptions,
): Promise<{
  webpackConfigs: { [name: string]: webpack.Configuration }
  buildNameToAppMeta: { [name: string]: AppMeta }
} | null> {
  if (!apps.length) {
    return null
  }

  const isInMonoRepo = await getIsInMonorepo()
  // the mode used for base.dll, main, etc
  const mode = buildMode.main
  const directory = options.workspaceRoot
  const outputDir = join(directory, 'dist', mode)

  // used for non-app packages
  const watch = options.dev && options.action === 'run'

  log.info(
    `dev ${options.dev} watch ${watch} ${directory}, apps ${apps.length} ${isInMonoRepo}`,
    options,
  )

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
      hot: true,
      ...params,
    })
  }

  const webpackConfigs: { [key: string]: webpack.Configuration } = {}

  // contains react-dom/react, always in production
  const baseProdParams: WebpackParams = {
    name: `baseProd`,
    entry: ['react', 'react-dom', 'react-hot-loader'],
    watch,
    target: 'web',
    mode: 'production',
    context: directory,
    outputDir,
    publicPath: '/',
    outputFile: 'baseProd.dll.js',
    output: {
      library: 'base',
    },
    dll: join(outputDir, 'manifest-baseProd.json'),
  }
  const baseProdConfig = await addDLL(baseProdParams)
  webpackConfigs.baseProd = baseProdConfig

  // contains react-hot-loader, always in development
  const baseDevParams: WebpackParams = {
    name: `baseDev`,
    entry: ['react', 'react-dom', 'react-hot-loader'],
    watch,
    target: 'web',
    mode: 'development',
    context: directory,
    outputDir,
    publicPath: '/',
    outputFile: 'baseDev.dll.js',
    output: {
      library: 'base',
    },
    dll: join(outputDir, 'manifest-baseDev.json'),
  }
  const baseDevConfig = await addDLL(baseDevParams)
  webpackConfigs.baseDev = baseDevConfig
  const baseDevDllReference = {
    manifest: baseDevParams.dll,
    filepath: join(outputDir, baseDevParams.outputFile),
  }

  // contains most dependencies
  const sharedParams = await getBaseDllParams({
    outputDir,
    context: directory,
    mode,
    dllReferences: [baseDevDllReference],
  })

  if (isInMonoRepo) {
    sharedParams.mode = mode
    sharedParams.watch = watch
    webpackConfigs.base = await addDLL(sharedParams)
  }
  const sharedDllReference = {
    manifest: sharedParams.dll,
    filepath: join(outputDir, sharedParams.outputFile),
  }

  // add app dll configs
  const appParams: WebpackParams[] = await Promise.all(
    apps.map(async app => {
      const cleanName = stringToIdentifier(app.packageId)
      const dllFile = join(outputDir, `manifest-${cleanName}.json`)
      const appEntry = await getAppEntry(app.directory, app.packageJson)
      const appMode = buildMode[app.packageId]
      if (!appMode) {
        throw new Error(`No buildMode set for app ${app.packageId} ${JSON.stringify(buildMode)}`)
      }
      const params: WebpackParams = {
        name: `${cleanName}`,
        entry: [appEntry],
        context: directory,
        mode: appMode,
        target: 'web',
        publicPath: '/',
        outputFile: `${cleanName}.${appMode}.dll.js`,
        outputDir,
        injectHot: true,
        hotType: 'app',
        output: {
          library: cleanName,
        },
        dll: dllFile,
        // apps use the base dll
        dllReferences: [baseDevDllReference, sharedDllReference],
      }
      return params
    }),
  )
  const buildNameToAppMeta: { [name: string]: AppMeta } = {}
  await Promise.all(
    appParams.map(async (params, index) => {
      const appMeta = apps[index]
      const config = await addDLL({
        ...getAppParams(params),
        // only watch apps for updates in development mode
        watch: buildMode[appMeta.packageId] === 'development',
      })
      buildNameToAppMeta[params.name] = appMeta
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
        outputDir: join(outputDir, 'orbit-app'),
        mode,
        context: directory,
        entry: [entry],
        ignore: ['electron-log', 'configstore', '@o/worker-kit'],
        target: 'web',
        watch,
        hot: true,
        dllReferences,
        output: {
          library: '__orbit_main',
        },
      },
      extraMainConfig,
    )
  }

  return {
    webpackConfigs,
    buildNameToAppMeta,
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
      libraryTarget: 'system',
      ...props.output,
    },
  }
}

async function getBaseDllParams(params: WebpackParams): Promise<WebpackParams> {
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
  ]

  // gather all packages we want included in base dll
  // i had to add this at one point because webpack stopped providing
  // the sub-packages of @o/ui and @o/kit, not sure why that happened
  let allPackages = [...basePackages]
  for (const pkg of basePackages) {
    try {
      const path = require.resolve(`${pkg}/package.json`)
      const pkgJson = await readJSON(path)
      const deps = [
        ...Object.keys(pkgJson.dependencies || {}),
        ...Object.keys(pkgJson.peerDependencies || {}),
      ]
      allPackages = [...allPackages, ...deps]
    } catch (err) {
      // for example @o/ui/config/package.json isnt here
      log.verbose(`Possible error resolving ${pkg}`, err)
    }
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
    name: `shared`,
    injectHot: join(require.resolve('@o/kit'), '..', '..', 'src', 'index.ts'),
    entry: [...new Set(allPackages)],
    ignore: ['electron-log', 'configstore', 'typeorm'],
    watch: false,
    target: 'web',
    publicPath: '/',
    outputFile: 'shared.dll.js',
    output: {
      library: 'shared',
    },
    dll: join(params.outputDir, 'manifest-base.json'),
    ...params,
  }
}
