import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { AppCreateNewCommand, AppCreateNewOptions, Space, StatusReply } from '@o/models'
import { pathExists } from 'fs-extra'
import { commandNew } from 'orbit'
import { join } from 'path'
import sanitize from 'sanitize-filename'

import { getCurrentWorkspace } from '../helpers/getCurrentWorkspace'
import { OrbitDesktopRoot } from '../OrbitDesktopRoot'
import { statusReplyCommand } from '../WorkspaceManager/commandHelpers'
import { ensureWorkspaceModel } from '../WorkspaceManager/ensureWorkspaceModel'

const log = new Logger('AppCreateNewCommand')

export function createAppCreateNewResolver(orbitDesktop: OrbitDesktopRoot) {
  return resolveCommand(
    AppCreateNewCommand,
    statusReplyCommand(async props => {
      const directory = props.projectRoot || (await getCurrentWorkspace()).directory
      log.info(
        `Creating new app ${props.name} ${props.identifier} ${props.template} in ${directory}`,
      )
      if (!props.identifier || !props.name || !props.template) {
        throw new Error(
          `Missing some props, needs identifier + name + template ${JSON.stringify(props)}`,
        )
      }
      const ws = await ensureWorkspaceModel(directory)
      return await createNewWorkspaceApp(ws, props)
    }),
  )

  async function createNewWorkspaceApp(
    space: Space,
    opts: AppCreateNewOptions,
  ): Promise<StatusReply> {
    const appsDir = join(space.directory, 'apps')
    const name = await findValidDirectoryName(appsDir, opts.identifier)
    let res = await commandNew({
      projectRoot: appsDir,
      name,
      template: opts.template,
      icon: opts.icon,
      identifier: opts.identifier,
    })
    if (res.type === 'error') {
      return res
    }
    // ensure we update the workspace with new package id
    await orbitDesktop.workspaceManager.updateAppsBuilder()
    return {
      type: 'success',
      message: `Starting workspace`,
    }
  }
}

async function findValidDirectoryName(rootDir: string, preferredName: string) {
  let i = 0
  let base = `${sanitize(preferredName)}`
  if (base.length === 0) {
    base = `myapp`
  }
  while (i < 10) {
    i++
    const name = i === 1 ? base : `${base}-${i}`
    const path = join(rootDir, name)
    if (await pathExists(path)) {
      continue
    }
    return name
  }
  throw new Error(`Couldn't find a valid directory ${preferredName}`)
}
