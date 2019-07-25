import { baseWorkspaceDir, configStore } from '@o/config'
import { AppDevCloseCommand, AppDevOpenCommand, AppOpenWindowCommand, CommandDevOptions } from '@o/models'
import { copy, pathExists } from 'fs-extra'
import { join } from 'path'

import { commandWs, isInWorkspace } from './command-ws'
import { getOrbitDesktop } from './getDesktop'
import { addProcessDispose } from './processDispose'
import { reporter } from './reporter'

export async function commandDev(options: CommandDevOptions) {
  const { mediator, didStartOrbit } = await getOrbitDesktop()

  if (!mediator) {
    reporter.panic('No mediator found')
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

  try {
    const appId = await mediator.command(AppDevOpenCommand, options)
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
