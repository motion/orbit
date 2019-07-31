import { Logger } from '@o/logger'
import { AppMeta, CommandWsOptions } from '@o/models'
import { ensureDir, ensureSymlink, pathExists, readJSON, writeFile } from 'fs-extra'
import { join } from 'path'
import webpack from 'webpack'

import { getIsInMonorepo } from './getIsInMonorepo'
import { DLLReferenceDesc, makeWebpackConfig, WebpackParams } from './makeWebpackConfig'
import { webpackPromise } from './webpackPromise'

const log = new Logger('getAppsConfig')

const cleanString = (x: string) =>
  x
    .replace(/[^a-z0-9_]/gi, '_')
    .replace(/-{2,}/g, '_')
    .replace(/^[^a-z]/i, '')
    .replace(/[^a-z]$/i, '')

/**
 * This returns the configuration object for everything:
 *   1. a base.dll.js that includes the big shared libraries
 *   2. each app as it's own dll
 *   3. the "main" entry point with orbit-app
 */

export async function getAppsConfig(directory: string, apps: AppMeta[], options: CommandWsOptions) {
  if (!apps.length) {
    return null
  }

  log.info(`mode ${options.mode} ${directory}, apps ${apps.length}`, options)

  const isInMonoRepo = await getIsInMonorepo()

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

  const outputDir = join(directory, 'dist')
  let dllReferences: DLLReferenceDesc[] = []

  /**
   * Webpack fails to handle DLLs properly on first build, you can't put them all into
   * one config. You need to build them once before running the dllReference (main) app.
   * This inline function just ensures we build + reference them.
   */
  async function addDLL(params: WebpackParams): Promise<webpack.Configuration> {
    // add to dlls
    dllReferences.push({
      manifest: params.dll,
      filepath: join(params.outputDir || outputDir, params.outputFile),
    })
    // ensure built
    if (options.clean || !(await pathExists(params.dll))) {
      log.info(`Ensuring config built once: ${params.name}...`)
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
      watch: true,
    })
  }

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
    'webpack-hot-middleware',
  ]
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
  allPackages = allPackages.filter(
    x =>
      x !== 'electron-log' &&
      x !== 'configstore' &&
      x !== 'react-use' &&
      x !== '@babel/runtime' &&
      x !== 'typeorm',
  )

  // base dll with shared libraries
  const baseDllManifest = join(outputDir, 'manifest-base.json')
  const baseDllOutputFileName = 'base.dll.js'
  const baseConfig = await addDLL({
    name: `base`,
    entry: [...new Set(allPackages)],
    ignore: ['electron-log', 'configstore', 'typeorm'],
    context: directory,
    mode: options.mode,
    target: 'web',
    publicPath: '/',
    outputFile: baseDllOutputFileName,
    outputDir,
    output: {
      library: 'base',
    },
    dll: baseDllManifest,
  })

  // apps dlls with just each apps code
  const appParams: WebpackParams[] = await Promise.all(
    apps.map(async app => {
      const cleanName = cleanString(app.packageId)
      const dllFile = join(outputDir, `manifest-${cleanName}.json`)
      const appEntry = join(
        app.directory,
        (await readJSON(join(app.directory, 'package.json'))).main,
      )
      const params: WebpackParams = {
        name: `app_${cleanName}`,
        entry: [appEntry],
        context: directory,
        mode: options.mode,
        target: 'web',
        publicPath: '/',
        outputFile: `${cleanName}.dll.js`,
        outputDir,
        injectHot:
          app.packageId === '@o/demo-app-api-grid' ||
          app.packageId === '@o/lists-app' ||
          app.packageId === '@o/people-app' ||
          app.packageId === '@o/demo-app-layout' ||
          app.packageId === '@o/demo-app-flow',
        output: {
          library: cleanName,
        },
        // output: {
        //   // TODO(andreypopp): sort this out, we need some custom symbol here which
        //   // we will communicate to Orbit
        //   library: `window['LoadOrbitApp_${index}']`,
        //   libraryTarget: 'assign',
        //   libraryExport: 'default',
        // },
        dll: dllFile,
        // apps use the base dll
        dllReferences: [
          {
            manifest: baseDllManifest,
            filepath: join(outputDir, baseDllOutputFileName),
          },
        ],
      }
      return params
    }),
  )
  const appsConfigs = {}
  await Promise.all([
    appParams.map(async params => {
      const config = await addDLL(getAppParams(params))
      appsConfigs[params.name] = config
    }),
  ])

  /**
   * Get the monorepo in development mode and build orbit
   */
  let entry = ''
  let extraConfig
  if (isInMonoRepo) {
    // main entry for orbit-app
    const monoRoot = join(__dirname, '..', '..', '..', '..')
    const appEntry = join(monoRoot, 'app', 'orbit-app', 'src', 'main')
    entry = appEntry
    const extraConfFile = join(appEntry, '..', '..', 'webpack.config.js')
    if (await pathExists(extraConfFile)) {
      extraConfig = require(extraConfFile)
    }
  }

  /**
   * Build appDefinitions.js which the main app uses to dynamically load apps
   */
  const appDefinitionsSrc = `
// all apps
${apps
  .map((app, index) => {
    // const params = appParams[index]
    // const name = params.name
    return `
export const app_${index} = require('${app.packageId}')
`
    // didnt work, calls it but doesnt hmr the code
    // require('webpack-hot-middleware/client?name=${name}&path=/__webpack_hmr_${name}')
  })
  .join('\n')}`
  const appDefsFile = join(entry, '..', '..', 'appDefinitions.js')
  log.info(`appDefsFile ${appDefsFile}`)
  await writeFile(appDefsFile, appDefinitionsSrc)

  /**
   * Allows for our orbit app to define some extra configuration
   * Could be used similarly in the future, if wanted, for apps too.
   */
  let extraEntries = {}
  let extraMainConfig = null

  if (extraConfig) {
    const { main, ...others } = extraConfig
    extraMainConfig = main
    for (const name in others) {
      extraEntries[name] = await makeWebpackConfig(
        {
          mode: options.mode,
          name,
          outputFile: `${name}.js`,
          outputDir,
          context: directory,
          ignore: ['electron-log', 'configstore'],
          target: 'web',
          hot: true,
          watch: true,
        },
        extraConfig[name],
      )
      log.info(`extra entry: ${name}`)
    }
  }

  /**
   * The orbit main app config
   */
  dllReferences.reverse()
  const mainConfig = await makeWebpackConfig(
    {
      name: 'main',
      outputFile: 'main.js',
      outputDir,
      mode: options.mode,
      context: directory,
      entry: [entry],
      ignore: ['electron-log', 'configstore'],
      target: 'web',
      watch: true,
      hot: true,
      dllReferences,
    },
    extraMainConfig,
  )

  return {
    base: baseConfig,
    main: mainConfig,
    ...appsConfigs,
    ...extraEntries,
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
    ignore: ['electron-log', '@o/worker-kit'],
    ...props,
    output: {
      library: '[name]',
      libraryTarget: 'umd',
      ...props.output,
    },
  }
}
