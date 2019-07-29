import { commandNew } from '@o/cli'
import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { AppCreateNewCommand, AppCreateNewOptions, SpaceEntity } from '@o/models'
import { pathExists } from 'fs-extra'
import { join } from 'path'
import sanitize from 'sanitize-filename'

import { getCurrentWorkspace } from '../helpers/getCurrentWorkspace'
import { OrbitDesktopRoot } from '../OrbitDesktopRoot'

const log = new Logger('AppCreateNewCommand')

export function createAppCreateNewResolver(orbitDesktop: OrbitDesktopRoot) {
  return resolveCommand(AppCreateNewCommand, async ({ name, template, icon, identifier }) => {
    log.info(`Creating new app ${name} ${template}`)
    const ws = await getCurrentWorkspace()
    return await createNewWorkspaceApp(ws, { name, template, icon, identifier })
  })

  async function createNewWorkspaceApp(space: SpaceEntity, opts: AppCreateNewOptions) {
    try {
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
      return await orbitDesktop.workspaceManager.updateWorkspace()
    } catch (err) {
      return {
        type: 'error',
        message: `${err.message}`,
      } as const
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
