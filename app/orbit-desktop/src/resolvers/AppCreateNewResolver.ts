import { commandNew } from '@o/cli'
import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { AppCreateNewCommand, AppCreateNewOptions, SpaceEntity } from '@o/models'
import { pathExists } from 'fs-extra'
import { join } from 'path'
import sanitize from 'sanitize-filename'

import { getCurrentWorkspace } from './AppOpenWorkspaceResolver'

const log = new Logger('AppCreateNewCommand')

export const AppCreateNewResolver = resolveCommand(
  AppCreateNewCommand,
  async ({ name, template, icon, identifier }) => {
    log.info(`Creating new app ${name} ${template}`)
    const ws = await getCurrentWorkspace()
    return await createNewWorkspaceApp(ws, { name, template, icon, identifier })
  },
)

async function createNewWorkspaceApp(space: SpaceEntity, opts: AppCreateNewOptions) {
  // TODO icon
  try {
    const name = await findValidDirectoryName(space.directory, opts.identifier)
    return await commandNew({
      projectRoot: space.directory,
      name,
      template: opts.template,
    })
  } catch (err) {
    return {
      type: 'error',
      message: `${err.message}`,
    } as const
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
