import { Logger } from '@o/logger'
import { AppMeta, CommandWsOptions } from '@o/models'
import { ensureDir, ensureSymlink, pathExists, writeFile } from 'fs-extra'
import { join } from 'path'

import { getAppConfig } from './getAppConfig'
import { getIsInMonorepo } from './getIsInMonorepo'
import { makeWebpackConfig, WebpackParams } from './makeWebpackConfig'
import { webpackPromise } from './webpackPromise'

const log = new Logger('getAppsConfig')

export async function getAppsConfig(directory: string, apps: AppMeta[], options: CommandWsOptions) {
  if (!apps.length) {
    return null
  }

  const dllFile = join(directory, 'dist', 'manifest.json')
  log.info(`dllFile ${dllFile}`)

  const isInMonoRepo = await getIsInMonorepo(process.cwd())

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

  const appsConfBase: WebpackParams = {
    name: 'apps',
    entry: apps.map(x => x.packageId),
    context: directory,
    watch: false,
    mode: options.mode,
    target: 'web',
    publicPath: '/',
    outputFile: '[name].apps.js',
    output: {
      library: 'apps',
    },
    dll: dllFile,
  }

  // we have to build apps once
  if (options.clean || !(await pathExists(dllFile))) {
    log.info('building all apps once...')
    await webpackPromise([getAppConfig(appsConfBase)])
  }

  // create app config now with `hot`
  const appsConfig = getAppConfig({
    ...appsConfBase,
    watch: true,
    hot: true,
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

  /**
   * Writes out a file webpack will understand and import properly
   *
   * Notes:
   *
   *  It seems that webpack doesn't like dynamic imports when dealing with DLLs.
   *  So for now we do this. In production we'd need something different. My ideas
   *  for running in prod:
   *
   *   1. We build orbit itself as a static dll, but without the apps part
   *   2. We have it look for a global variable that has the apps
   *   3. The apps are a DLL as they are now
   *   4. Right now we build all of orbit (see isInMonoRepo above) in development mode,
   *      this lets us develop all of orbit at once nicely in dev. But we'd instead
   *      have the orbit DLL in production, and instead of importing orbit we'd have some
   *      smaller webpack config just for improting the apps, and injecting them into orbit
   *      via the global variable or similar.
   *
   */
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
  const wsConfig = await makeWebpackConfig(
    {
      name: 'main',
      mode: options.mode,
      context: directory,
      entry: [entry],
      target: 'web',
      watch: true,
      hot: true,
      dllReference: dllFile,
    },
    extraMainConfig,
  )

  return {
    main: wsConfig,
    apps: appsConfig,
    ...extraEntries,
  }
}
