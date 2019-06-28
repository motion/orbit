import { AppDevCloseCommand, AppDevOpenCommand, AppOpenWindowCommand } from '@o/models'
import { copy, pathExists, readJSON } from 'fs-extra'
import { join } from 'path'

import { isInWorkspace, commandWs } from './command-ws'
import { getOrbitDesktop } from './getDesktop'
import { addProcessDispose } from './processDispose'
import { reporter } from './reporter'
import { baseWorkspaceDir, configStore } from './util/configStore'

export type CommandDevOptions = { projectRoot: string }

export async function commandDev(options: CommandDevOptions) {
  const { mediator, didStartOrbit } = await getOrbitDesktop()

  if (!mediator) {
    process.exit(0)
  }

  if (didStartOrbit) {
    reporter.info(`Starting workspace from command: dev`)
    const baseWorkspace = await ensureBaseWorkspace()
    const lastWorkspace = configStore.lastActiveWorkspace.get()
    const workspaceRoot = (await isInWorkspace(options.projectRoot, lastWorkspace))
      ? lastWorkspace
      : baseWorkspace
    reporter.info(`Using workspace: ${workspaceRoot}`)

    await commandWs({
      workspaceRoot,
      // TODO
      mode: 'development',
    })
  }

  const entry = await getAppEntry(options.projectRoot)

  try {
    const appId = await mediator.command(AppDevOpenCommand, {
      path: options.projectRoot,
      entry: join(options.projectRoot, entry),
    })
    await mediator.command(AppOpenWindowCommand, {
      appId,
      isEditing: true,
    })
    addProcessDispose(async () => {
      reporter.info('Disposing orbit dev process...')
      await mediator.command(AppDevCloseCommand, {
        appId,
      })
    })
  } catch (err) {
    reporter.panic(`Error opening app for dev ${err.message}\n${err.stack}`)
  }
}

export async function getAppEntry(appRoot: string) {
  const pkg = await readJSON(join(appRoot, 'package.json'))
  return pkg['ts:main'] || pkg.main
}

/**
 * Copy an empty workspace somewhere so we can use it for developing apps outside a workspace
 */
async function ensureBaseWorkspace() {
  if (await pathExists(baseWorkspaceDir)) {
    return baseWorkspaceDir
  }
  await copy(join(__dirname, '..', 'base-workspace'), baseWorkspaceDir)
  return baseWorkspaceDir
}
