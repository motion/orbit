import { buildApp } from '@o/build-server'
import { AppOpenWorkspaceCommand } from '@o/models'
import { pathExists, readJSON } from 'fs-extra'
import { join } from 'path'

import { getIsInMonorepo, getOrbitDesktop } from './getDesktop'
import { reporter } from './reporter'

type CommandWSOptions = { workspaceRoot: string }

export async function commandWs(options: CommandWSOptions) {
  const appIdentifiers = await watchBuildWorkspace(options)
  return

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
  const entry: any = {}

  const isInMonoRepo = await getIsInMonorepo()
  if (isInMonoRepo) {
    // main entry for orbit-app
    const monoRoot = join(__dirname, '..', '..', '..')
    const appEntry = join(monoRoot, 'app', 'orbit-app', 'src', 'main')
    entry.main = appEntry
  }

  for (const { id, directory } of appRoots) {
    entry[id] = directory
  }
  console.log('building', entry)
  buildApp('workspace', {
    projectRoot: options.workspaceRoot,
    entry,
    target: 'web',
    outputFile: 'index.test.js',
    watch: true,
  })
  return appRoots.map(x => x.id)
}

async function getAppRoots(directory: string) {
  reporter.info('read space directory', directory)
  const pkg = await readJSON(join(directory, 'package.json'))
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
  let nodeModuleDir = join(directory, 'node_modules')

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
        return {
          id,
          directory,
        }
      }
    }),
  )
}
