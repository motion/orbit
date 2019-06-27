import {
  BuildServer,
  getAppConfig,
  makeWebpackConfig,
  WebpackParams,
  webpackPromise,
} from '@o/build-server'
import { AppOpenWorkspaceCommand } from '@o/models'
import { pathExists, readJSON, writeFile } from 'fs-extra'
import { join } from 'path'

import { getOrbitDesktop } from './getDesktop'
import { reporter } from './reporter'
import { configStore } from './util/configStore'
import { getIsInMonorepo } from './util/getIsInMonorepo'
import { updateWorkspacePackageIds } from './util/updateWorkspacePackageIds'

export type CommandWsOptions = {
  workspaceRoot: string
  clean: boolean
  mode: 'development' | 'production'
}

type PackageInfo = {
  id: string
  directory: string
  entry: string
}

export async function commandWs(options: CommandWsOptions) {
  reporter.info(`Running command ws`)

  const appIdentifiers = await watchBuildWorkspace(options)
  const { mediator } = await getOrbitDesktop()

  if (!mediator) {
    process.exit(0)
  }

  try {
    reporter.info('Sending open workspace command')
    await mediator.command(AppOpenWorkspaceCommand, {
      path: options.workspaceRoot,
      appIdentifiers,
    })
  } catch (err) {
    console.log('Error opening app for dev', err.message, err.stack)
    return
  }

  return
}

export type WsPackages = {
  appsRootDir: string
  appsInfo: PackageInfo[]
}

export async function watchBuildWorkspace(
  options: CommandWsOptions,
  workspacePackages?: WsPackages,
) {
  reporter.info(`Watching workspace ${options.workspaceRoot} in mode ${options.mode}`)

  if (!(await isOrbitWs(options.workspaceRoot))) {
    reporter.panic(
      `\nNot inside orbit workspace, add "config": { "orbitWorkspace": true } } to the package.json`,
    )
    return
  }

  const directory = options.workspaceRoot

  // update last active ws
  configStore.lastActiveWorkspace.set(directory)

  const { appsInfo, appsRootDir } = workspacePackages || (await getWorkspacePackagesInfo(directory))
  if (!appsInfo || !appsInfo.length) {
    reporter.info('No apps found')
  }

  const dllFile = join(__dirname, 'manifest.json')

  const appEntries = []
  for (const { id } of appsInfo) {
    appEntries.push(id)
  }

  const appsConf: WebpackParams = {
    name: 'apps',
    watch: false,
    mode: options.mode,
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
  if (options.clean || !(await pathExists(dllFile))) {
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
          mode: options.mode,
          name,
          outputFile: `${name}.js`,
          context: options.workspaceRoot,
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
      context: options.workspaceRoot,
      entry: [entry],
      target: 'web',
      watch: true,
      hot: true,
      dllReference: dllFile,
    },
    extraMainConfig,
  )

  const server = new BuildServer({
    main: wsConfig,
    apps: appsConfig,
    ...extraEntries,
  })

  await server.start()

  await updateWorkspacePackageIds(options.workspaceRoot)

  return appsInfo.map(x => x.id)
}

/**
 * Sends command to open workspace with latest appIdentifiers
 * Gets appIdentifiers by reading current workspace directory
 */
export async function reloadAppDefinitions(directory: string) {
  let orbitDesktop = await getOrbitDesktop()
  if (orbitDesktop) {
    const { appsInfo } = await getWorkspacePackagesInfo(directory)
    const appIdentifiers = appsInfo.map(x => x.id)
    await orbitDesktop.command(AppOpenWorkspaceCommand, {
      path: directory,
      appIdentifiers,
    })
  } else {
    reporter.info('No orbit desktop running, didnt reload active app definitions...')
  }
}

export async function isInWorkspace(packagePath: string, workspacePath: string): Promise<boolean> {
  try {
    const packageInfo = await readJSON(join(packagePath, 'package.json'))
    const workspaceInfo = await getWorkspacePackagesInfo(workspacePath)
    if (packageInfo && workspaceInfo) {
      return workspaceInfo.appsInfo.some(x => x.id === packageInfo.name)
    }
  } catch (err) {
    reporter.verbose(`Potential err ${err.message}`)
  }
  return false
}

/**
 * Look for package.json of apps in directory and return information on each
 */
async function getWorkspacePackagesInfo(
  spaceDirectory: string,
): Promise<null | {
  appsRootDir: string
  appsInfo: PackageInfo[]
}> {
  reporter.info(`read space spaceDirectory ${spaceDirectory}`)
  const pkg = await readJSON(join(spaceDirectory, 'package.json'))
  if (!pkg) {
    reporter.log('No package found!')
    return null
  }
  const packages = pkg.dependencies
  if (!packages) {
    reporter.log('No app definitions in package.json')
    return null
  }

  reporter.info(`found apps ${Object.keys(packages).join(', ')}`)
  let appsRootDir = ''

  const appsInfo = await Promise.all(
    Object.keys(packages).map(async id => {
      const directory = await findNodeModuleDir(spaceDirectory, id)
      if (directory) {
        appsRootDir = directory // can be last one
        return await getPackageInfo(directory)
      } else {
        reporter.error(`Not found ${id} in any node_modules ${spaceDirectory}`)
      }
    }),
  )

  return {
    appsRootDir,
    appsInfo: appsInfo.filter(Boolean),
  }
}

async function getPackageInfo(directory: string) {
  const appPkg = await readJSON(join(directory, 'package.json'))
  const entry = appPkg.main
  return {
    id: appPkg.name,
    directory,
    entry: join(directory, entry),
  }
}

async function findNodeModuleDir(startDir: string, packageName: string) {
  let modulesDir = join(startDir, 'node_modules')
  // find parent node_modules
  while (modulesDir !== '/node_modules') {
    const moduleDir = join(modulesDir, ...packageName.split('/'))
    if (await pathExists(moduleDir)) {
      return moduleDir
    }
    modulesDir = join(modulesDir, '..', '..', 'node_modules')
  }
  return null
}

export const isOrbitWs = async (rootDir: string) => {
  try {
    const pkg = await readJSON(join(rootDir, 'package.json'))
    return pkg.config && pkg.config.orbitWorkspace === true
  } catch (err) {
    reporter.error(err.message, err)
  }
  return false
}
