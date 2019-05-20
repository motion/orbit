import { AppOpenWorkspaceCommand } from '@o/models'
import { pathExists, readJSON } from 'fs-extra'
import { join } from 'path'

import { commandBuild } from './command-build'
import { getOrbitDesktop } from './getDesktop'
import { reporter } from './reporter'

type CommandWSOptions = { workspaceRoot: string }

export async function commandWs(options: CommandWSOptions) {
  let orbitDesktop = await getOrbitDesktop()

  if (!orbitDesktop) {
    process.exit(0)
  }

  watchBuildWorkspace(options)

  try {
    reporter.info('Sending open workspace command')
    await orbitDesktop.command(AppOpenWorkspaceCommand, {
      path: options.workspaceRoot,
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
  if (!appRoots) return
  for (const appRoot of appRoots) {
    console.log('watching app', appRoot)
    commandBuild({
      projectRoot: appRoot,
      watch: true,
    })
  }
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
      const pkgPath = join(nodeModuleDir, ...id.split('/'))
      if (await pathExists(pkgPath)) {
        return pkgPath
      }
    }),
  )
}
