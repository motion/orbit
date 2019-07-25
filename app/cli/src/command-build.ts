import { AppBuildCommand, CommandBuildOptions } from '@o/models'
import { pathExists, readJSON } from 'fs-extra'
import { join } from 'path'

import { getOrbitDesktop } from './getDesktop'
import { reporter } from './reporter'

export async function commandBuild(options: CommandBuildOptions) {
  reporter.info(`Running build in ${options.projectRoot}`)

  if (!(await isOrbitApp(options.projectRoot))) {
    reporter.panic(
      `\nNot inside an orbit app, add "config": { "orbitApp": true } } to the package.json`,
    )
  }

  const { mediator } = await getOrbitDesktop()
  if (!mediator) {
    reporter.panic('No mediator found')
  }

  await mediator.command(AppBuildCommand, options)
}

export const isOrbitApp = async (rootDir: string) => {
  const pkg = await readPackageJson(rootDir)
  return pkg && pkg.config && pkg.config.orbitApp === true
}

async function readPackageJson(appRoot: string) {
  const packagePath = join(appRoot, 'package.json')
  reporter.verbose(`isOrbitApp ${packagePath}`)
  if (!(await pathExists(packagePath))) {
    return null
  }
  try {
    return await readJSON(packagePath)
  } catch (err) {
    reporter.error(err.message, err)
  }
  return null
}
