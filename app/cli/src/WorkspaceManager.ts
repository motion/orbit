import { watch } from 'chokidar'
import {
  BuildServer,
  makeWebpackConfig,
  webpackPromise,
  getAppConfig,
  WebpackParams,
} from '@o/build-server'
import { reporter } from './reporter'
import { pathExists } from 'fs-extra'
import { updateWorkspacePackageIds } from './util/updateWorkspacePackageIds'
import { Logger } from '@o/logger'
import { getWorkspaceApps } from './util/getWorkspaceApps'
import { debounce } from 'lodash'
import { join } from 'path'
import { writeFile } from 'fs'
import { getIsInMonorepo } from './util/getIsInMonorepo'

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
 *     4. then desktop goes back to cli to actually run the WorkspaceManager
 */

const log = new Logger('WorkspaceManager')

type WorkspaceManagerOpts = {
  directory: string
  mode: 'development' | 'production'
  packages?: any
  clean?: boolean
}

export class WorkspaceManager {
  directory = ''
  options: WorkspaceManagerOpts
  disposables = new Set<{ id: string; dispose: Function }>()

  setWorkspace(opts: WorkspaceManagerOpts) {
    this.directory = opts.directory
    this.options = opts
  }

  start() {
    this.watchWorkspace()
  }

  stop() {
    ;[...this.disposables].forEach(x => x.dispose())
  }

  watchWorkspace() {
    const last = [...this.disposables].find(x => x.id === 'watcher')
    if (last) {
      last.dispose()
      this.disposables.delete(last)
    }
    let watcher = watch(this.directory, {
      persistent: true,
    })
    watcher.on('change', this.onWorkspaceChange)
    this.disposables.add({
      id: 'watcher',
      dispose: () => {
        watcher.close()
      },
    })
  }

  onWorkspaceChange = debounce(async () => {
    log.info(`See workspace change`)
    const config = await this.getAppsConfig()
    const server = new BuildServer(config)
    await server.start()
    await updateWorkspacePackageIds(this.directory)
  }, 50)

  async getAppsConfig() {
    const apps = await getWorkspaceApps(this.directory)
    if (!apps || !apps.length) {
      reporter.info('No apps found')
    }

    const dllFile = join(__dirname, 'manifest.json')

    const appEntries = []
    for (const { packageId } of apps) {
      appEntries.push(packageId)
    }

    const appsConf: WebpackParams = {
      name: 'apps',
      watch: false,
      mode: this.options.mode,
      entry: appEntries,
      context: appsRootDir,
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
      console.log('building all apps once...')
      await webpackPromise([getAppConfig(appsConf)])
    }

    // create app config now with `hot`
    const appsConfig = getAppConfig({
      ...appsConf,
      watch: true,
      hot: true,
    })

    let entry = ''
    let extraConfig
    const isInMonoRepo = await getIsInMonorepo()
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

    if (entry) {
      await writeFile(
        join(entry, '..', '..', 'appDefinitions.js'),
        `
        // all apps
        ${appsInfo
          .map(app => {
            return `export const ${app.id.replace(/[^a-zA-Z]/g, '')} = require('${app.id}')`
          })
          .join('\n')}
      `,
      )
    }

    // we pass in extra webpack config for main app
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
