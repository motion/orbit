import { Logger } from '@o/logger'
import { AppMeta, CommandWsOptions } from '@o/models'
import { ensureDir, ensureSymlink, pathExists, writeFile } from 'fs-extra'
import { join } from 'path'
import webpack from 'webpack'

import { getAppConfig } from './getAppConfig'
import { getIsInMonorepo } from './getIsInMonorepo'
import { makeWebpackConfig, WebpackParams } from './makeWebpackConfig'
import { webpackPromise } from './webpackPromise'

const log = new Logger('getAppsConfig')

const cleanString = (x: string) => x.replace(/[^a-z0-9_]/gi, '-').replace(/-{2,}/g, '-')

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

  const dllsDir = join(directory, 'dist')
  let dllReferences = []

  // base dll with shared libraries
  const baseDllFile = join(dllsDir, 'manifest-base.json')
  dllReferences.push(baseDllFile)
  const baseWebpackParams: WebpackParams = {
    name: `base`,
    entry: ['@o/kit', '@o/ui', '@o/utils'],
    ignore: ['electron-log', 'configstore'],
    context: directory,
    watch: false,
    mode: options.mode,
    target: 'web',
    publicPath: '/',
    outputFile: '[name].base.js',
    output: {
      library: 'base',
    },
    dll: baseDllFile,
  }
  const baseConfig = await makeWebpackConfig(baseWebpackParams)
  if (options.clean || !(await pathExists(baseWebpackParams.dll))) {
    log.info(`Ensuring base config built once...`)
    await webpackPromise([baseConfig], { loud: true })
  }

  // apps dlls with just each apps code
  const appsBaseConfigs: WebpackParams[] = apps.map(app => {
    const cleanName = cleanString(app.packageId)
    const dllFile = join(dllsDir, `manifest-${cleanName}.json`)
    dllReferences.push(dllFile)
    return {
      name: `app-${cleanName}`,
      entry: [app.directory],
      context: directory,
      watch: false,
      mode: options.mode,
      target: 'web',
      publicPath: '/',
      outputFile: `[name].${cleanName}.js`,
      output: {
        library: cleanName,
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
      dllReferences: [baseDllFile],
    }
  })

  // ensure we've built all apps once at least
  for (const appConf of appsBaseConfigs) {
    if (options.clean || !(await pathExists(appConf.dll))) {
      log.info(`Building DLL first time ${appConf.dll}...`)
      await webpackPromise([getAppConfig(appConf)], { loud: true })
    }
  }

  // create app config now with `hot`
  const appsConfigs: webpack.Configuration[] = appsBaseConfigs.map(conf => {
    return getAppConfig({
      ...conf,
      watch: true,
      hot: true,
    })
  })

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
  const mainConfig = await makeWebpackConfig(
    {
      name: 'main',
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
