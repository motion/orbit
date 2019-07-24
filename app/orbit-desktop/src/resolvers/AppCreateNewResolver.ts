import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { AppCreateNewCommand, AppCreateNewOptions, SpaceEntity } from '@o/models'

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
  try {
    const path = await findValidDirectory(space.directory, opts.identifier)

    await createNewAppFromTemplate({
      ...opts,
      path,
    })

    return {
      type: 'success',
      message: `Created new app`,
    } as const
  } catch (err) {
    return {
      type: 'error',
      message: `${err.message}`,
    } as const
  }
}

async function findValidDirectory(rootDir: string, preferredName: string) {
  let i = 0
  while (i < 10) {
    i++
    // TODO
  }
  throw new Error(`Couldn't find a valid directory ${preferredName}`)
}

async function createNewAppFromTemplate(opts: AppCreateNewOptions & { path: string }) {
  // TODO
}
