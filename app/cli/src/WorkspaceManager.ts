import {
  BuildServer,
  getAppConfig,
  makeWebpackConfig,
  WebpackParams,
  webpackPromise,
} from '@o/build-server'
import { Logger } from '@o/logger'
import { AppMeta } from '@o/models'
import { watch } from 'chokidar'
import { ensureDir, ensureSymlink, pathExists, writeFile } from 'fs-extra'
import { debounce, isEqual } from 'lodash'
import { join } from 'path'

import { CommandWsOptions } from './command-ws'
import { reporter } from './reporter'
import { getIsInMonorepo } from './util/getIsInMonorepo'
import { getWorkspaceApps } from './util/getWorkspaceApps'
import { updateWorkspacePackageIds } from './util/updateWorkspacePackageIds'
import { getAppEntry } from './command-dev'
import { bundleApp, getBuildInfo } from './command-build'

//
// TODO we need to really improve this:
//   1. we need a way to just load in apps that you are developing
//   2. need to remove getWorkspacePackagesInfo in favor of getWorkspaceApps
//   3. need to build local apps and installed apps separately (solve #1 by just only ever loading app server for local apps)
//   4. that opens up forking apps
//

/**
 * PLAN:
 *
 *   - orbit-desktop need to run everything so we can bonjour to it to run and have it act as a daemon
 *   - but we want to be able to update the build/cli stuff more often than the app bundle itself
 *   - SO:
 *     1. keep everything in the cli
 *     2. have orbit-desktop run the cli by requiring it
 *     3. have cli make a call to desktop to run everything so it goes through single place
 *     4. then desktop goes back to cli to actually run the WorkspaceManager, this lets us update cli independently
 */

const log = new Logger('WorkspaceManager')

type Disposable = Set<{ id: string; dispose: Function }>

const disposeAll = (x: Disposable) => x.forEach(x => x.dispose())
const dispose = (x: Disposable, id: string) => x.forEach(x => x.id === id && x.dispose())

export class WorkspaceManager {
  apps: AppMeta[] = []
  directory = ''
  options: CommandWsOptions
  buildConfig = null
  buildServer: BuildServer | null = null
  wsWatchers: Disposable = new Set<{ id: string; dispose: Function }>()
  appWatchers: Disposable = new Set<{ id: string; dispose: Function }>()

  setWorkspace(opts: CommandWsOptions) {
    this.directory = opts.workspaceRoot
    this.options = opts
  }

  start() {
    this.watchWorkspace()
    this.onWorkspaceChange()
  }

  stop() {
    disposeAll(this.wsWatchers)
    disposeAll(this.appWatchers)
  }

  private watchWorkspace() {
    dispose(this.wsWatchers, 'watcher')
    let watcher = watch(this.directory, {
      persistent: true,
      // only watch top level
      depth: 0,
    })
    watcher.on('change', this.onWorkspaceChange)
    this.wsWatchers.add({
      id: 'watcher',
      dispose: () => {
        watcher.close()
      },
    })
  }

  private onWorkspaceChange = debounce(async () => {
    log.info(`See workspace change`)
    await this.updateApps()
    const config = await this.getAppsConfig()

    if (!config) {
      reporter.error('No apps found')
      return
    }

    log.info(`workspace app config`, JSON.stringify(config, null, 2))

    if (!isEqual(this.buildConfig, config)) {
      this.buildConfig = config
      if (this.buildServer) {
        this.buildServer.stop()
      }
      this.buildServer = new BuildServer(config)
      await this.buildServer.start()
      await updateWorkspacePackageIds(this.directory)
    }
  }, 50)

  async updateApps() {
    const next = await getWorkspaceApps(this.directory)

    if (!isEqual(next, this.apps)) {
      // remove old
      for (const app of this.apps) {
        if (next.some(x => x.packageId === app.packageId) === false) {
          dispose(this.appWatchers, app.packageId)
        }
      }

      // add new
      for (const app of next) {
        if (this.apps.some(x => x.packageId === app.packageId) === false) {
          // watch app for changes to build buildInfo
          this.addAppWatcher(app)
        }
      }

      this.apps = next
    }
  }

  /**
   * For now, this just watches and builds the app
   *
   *   TODO really this shouldn't really be a watcher here, probably just put it in command-build
   *        and have command-build just use webpack to watch and build everyting necessary.
   *
   */
  private async addAppWatcher(app: AppMeta) {
    const entry = await getAppEntry(app.directory)
    log.info(`Adding app watcher ${app.packageId} ${entry}`)
    // watch just the entry file to update buildInfo.json/appEntry.js
    let watcher = watch(entry, {
      persistent: true,
      awaitWriteFinish: true,
    })

    const buildAppInfo = () => {
      log.info(`buildAppInfo ${app.packageId}`)
      bundleApp(entry, {
        projectRoot: app.directory,
      })
    }

    watcher.on('change', debounce(buildAppInfo, 100))

    // build once if not built yet
    if (!(await getBuildInfo(app.directory))) {
      buildAppInfo()
    }

    this.appWatchers.add({
      id: app.packageId,
      dispose: () => {
        watcher.close()
      },
    })
  }

  private async getAppsConfig() {
    if (!this.apps.length) {
      return null
    }

    const dllFile = join(this.directory, 'dist', 'manifest.json')
    log.info(`dllFile ${dllFile}`)

    const isInMonoRepo = await getIsInMonorepo()

    // link local apps into local node_modules
    await ensureDir(join(this.directory, 'node_modules'))
    await Promise.all(
      this.apps
        .filter(x => x.isLocal)
        .map(async app => {
          const where = join(
            this.directory,
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
      entry: this.apps.map(x => x.packageId),
      context: this.directory,
      watch: false,
      mode: this.options.mode,
      target: 'web',
      publicPath: '/',
      outputFile: '[name].apps.js',
      output: {
        library: 'apps',
      },
      dll: dllFile,
    }

    // we have to build apps once
    if (this.options.clean || !(await pathExists(dllFile))) {
      reporter.info('building all apps once...')
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
      const monoRoot = join(__dirname, '..', '..', '..')
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
${this.apps
  .map((app, index) => {
    return `export const app_${index} = require('${app.packageId}')`
  })
  .join('\n')}`
    const appDefsFile = join(entry, '..', '..', 'appDefinitions.js')
    reporter.info(`appDefsFile ${appDefsFile}`)
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
            mode: this.options.mode,
            name,
            outputFile: `${name}.js`,
            context: this.directory,
            target: 'web',
            hot: true,
          },
          extraConfig[name],
        )
        reporter.info(`extra entry: ${name}`)
      }
    }

    /**
     * The orbit main app config
     */
    const wsConfig = await makeWebpackConfig(
      {
        name: 'main',
        context: this.directory,
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
}