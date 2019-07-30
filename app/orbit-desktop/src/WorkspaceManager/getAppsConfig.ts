import { Logger } from '@o/logger'
import { AppMeta, CommandWsOptions } from '@o/models'
import { ensureDir, ensureSymlink, pathExists, writeFile } from 'fs-extra'
import { join } from 'path'
import webpack from 'webpack'

import { getAppConfig } from './getAppConfig'
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

export async function getAppsConfig(directory: string, apps: AppMeta[], options: CommandWsOptions) {
  if (!apps.length) {
    return null
  }

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
  async function addDLL(params: WebpackParams, config: webpack.Configuration) {
    // add to dlls
    dllReferences.push({
      manifest: params.dll,
      filepath: join(params.outputDir || outputDir, params.outputFile),
    })
    // ensure built
    if (options.clean || !(await pathExists(params.dll))) {
      log.info(`Ensuring config built once: ${params.name}...`)
      await webpackPromise([{ ...config, watch: false }], { loud: true })
    }
    return config
  }

  // base dll with shared libraries
  const baseDllManifest = join(outputDir, 'manifest-base.json')
  const baseDllOutputFileName = 'base.dll.js'
  const baseWebpackParams: WebpackParams = {
    name: `base`,
    entry: ['@o/kit', '@o/ui', '@o/utils'],
    ignore: ['electron-log', 'configstore'],
    context: directory,
    watch: false,
    mode: options.mode,
    target: 'web',
    publicPath: '/',
    outputFile: baseDllOutputFileName,
    outputDir,
    output: {
      library: 'base',
    },
    dll: baseDllManifest,
  }
  const baseConfig = await makeWebpackConfig(baseWebpackParams)
  await addDLL(baseWebpackParams, baseConfig)

  // apps dlls with just each apps code
  const appParams: WebpackParams[] = apps.map((app, index) => {
    const cleanName = cleanString(app.packageId)
    const dllFile = join(outputDir, `manifest-${cleanName}.json`)
    return {
      name: `app-${cleanName}`,
      entry: [app.directory],
      context: directory,
      watch: true,
      hot: true,
      mode: options.mode,
      target: 'web',
      publicPath: '/',
      outputFile: `${cleanName}.dll.js`,
      outputDir,
      output: {
        library: `@o/app_${index}`,
      },
      // output: {
      //   // TODO(andreypopp): sort this out, we need some custom symbol here which
      //   // we will communicate to Orbit
      //   library: 'window.OrbitAppToRun',
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
  })
  // create app config now with `hot`
  const appsConfigs = await Promise.all(appParams.map(getAppConfig).map(x => makeWebpackConfig(x)))
  // ensure we've built all apps once at least
  for (const [index, appConf] of appsConfigs.entries()) {
    await addDLL(appParams[index], appConf)
  }

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

  const appDefinitionsSrc = `
// all apps
${apps
  .map((app, index) => {
    return `export const app_${index} = require('${app.packageId}')`
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
