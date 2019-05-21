import { buildApp, BuildServer, getAppConfig } from '@o/build-server'
import { WebpackParams } from '@o/build-server/_/makeWebpackConfig'
import { AppOpenWorkspaceCommand } from '@o/models'
import { pathExists, readJSON } from 'fs-extra'
import { join } from 'path'

import { getIsInMonorepo, getOrbitDesktop } from './getDesktop'
import { reporter } from './reporter'

type CommandWSOptions = { workspaceRoot: string }

export async function commandWs(options: CommandWSOptions) {
  const appIdentifiers = await watchBuildWorkspace(options)

  let orbitDesktop = await getOrbitDesktop()

  if (!orbitDesktop) {
    process.exit(0)
  }

  try {
    reporter.info('Sending open workspace command')
    await orbitDesktop.command(AppOpenWorkspaceCommand, {
      path: options.workspaceRoot,
      appIdentifiers,
    })
  } catch (err) {
    console.log('Error opening app for dev', err.message, err.stack)
    return
  }

  return
}

async function watchBuildWorkspace(options: CommandWSOptions) {
  const directory = options.workspaceRoot
  const appRoots = await getAppRoots(directory)
  if (!appRoots || !appRoots.length) {
    console.log('No apps found')
    return []
  }
  const dllFile = join(__dirname, 'manifest.json')
  console.log('dllFile', dllFile)

  const appEntries = []
  for (const { entry } of appRoots) {
    appEntries.push(entry)
  }

  const appsConf: WebpackParams = {
    projectRoot: directory,
    entry: appEntries,
    target: 'web',
    outputFile: '[name].test.js',
    watch: false,
    dll: dllFile,
  }

  if (!(await pathExists(dllFile))) {
    // we have to build apps once
    console.log('building apps DLL...')
    await buildApp('apps', appsConf)
  }

  const appsConfig = await getAppConfig('apps', {
    ...appsConf,
    watch: true,
  })

  let entry = ''
  const isInMonoRepo = await getIsInMonorepo()
  if (isInMonoRepo) {
    // main entry for orbit-app
    const monoRoot = join(__dirname, '..', '..', '..')
    const appEntry = join(monoRoot, 'app', 'orbit-app', 'src', 'main')
    entry = appEntry
  }
  const wsConfig = await getAppConfig('workspace', {
    projectRoot: options.workspaceRoot,
    entry: {
      workspace: entry,
    },
    target: 'web',
    outputFile: '[name].test.js',
    watch: true,
    devServer: true,
    dllReference: dllFile,
  })

  const server = new BuildServer([wsConfig, appsConfig])

  await server.start()

  return appRoots.map(x => x.id)
}

async function getAppRoots(spaceDirectory: string) {
  reporter.info('read space spaceDirectory', spaceDirectory)
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

  reporter.info('found packages', packages)
  let nodeModuleDir = join(spaceDirectory, 'node_modules')

  // find parent node_modules
  while (!(await pathExists(nodeModuleDir)) && nodeModuleDir !== '/') {
    nodeModuleDir = join(nodeModuleDir, '..', '..', 'node_modules')
  }

  if (!(await pathExists(nodeModuleDir))) {
    reporter.info('Error no node_modules directory found')
    return null
  }

  return await Promise.all(
    Object.keys(packages).map(async id => {
      const directory = join(nodeModuleDir, ...id.split('/'))
      if (await pathExists(directory)) {
        const appPkg = await readJSON(join(directory, 'package.json'))
        const entry = appPkg.main
        return {
          id,
          directory,
          entry: join(directory, entry),
        }
      }
    }),
  )
}
