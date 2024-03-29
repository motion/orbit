import { Logger } from '@o/logger'
import { CommandOpts, resolveCommand } from '@o/mediator'
import { AppCreateNewCommand, AppCreateNewOptions, Space, StatusReply } from '@o/models'
import { pathExists } from 'fs-extra'
import { commandNew } from 'orbit'
import { join } from 'path'
import sanitize from 'sanitize-filename'

import { getCurrentWorkspace } from '../helpers/getCurrentWorkspace'
import { OrbitDesktopRoot } from '../OrbitDesktopRoot'
import { commandBuild } from '../WorkspaceManager/commandBuild'
import { attachLogToCommand, statusReplyCommand } from '../WorkspaceManager/commandHelpers'
import { ensureWorkspaceModel } from '../WorkspaceManager/ensureWorkspaceModel'

const log = new Logger('AppCreateNewCommand')

export function createAppCreateNewResolver(orbitDesktop: OrbitDesktopRoot) {
  return resolveCommand(AppCreateNewCommand, statusReplyCommand(commandCreateNew))

  async function commandCreateNew(props: AppCreateNewOptions, cmdOpts: CommandOpts) {
    // pipe logs back to command
    attachLogToCommand(log, cmdOpts)
    // run command
    const directory = props.projectRoot || (await getCurrentWorkspace()).directory
    log.info(`Creating new app ${props.name} ${props.identifier} ${props.template} in ${directory}`)
    if (!props.identifier || !props.name || !props.template) {
      throw new Error(
        `Missing some props, needs identifier + name + template ${JSON.stringify(props)}`,
      )
    }
    const ws = await ensureWorkspaceModel(directory)
    return await createNewWorkspaceApp(ws, props, cmdOpts)
  }

  async function createNewWorkspaceApp(
    space: Space,
    opts: AppCreateNewOptions,
    cmdOpts: CommandOpts,
  ): Promise<StatusReply> {
    log.verbose(`createNewWorkspaceApp() ${space.directory} ${!!opts} ${!!cmdOpts}`)
    const appsDir = join(space.directory, 'apps')
    const name = await findValidDirectoryName(appsDir, opts.identifier)

    let res = await commandNew(
      {
        projectRoot: appsDir,
        name,
        template: opts.template,
        icon: opts.icon,
        identifier: opts.identifier,
      },
      cmdOpts,
    )

    // start watching here because it will pick up right away

    if (res.type === 'error') {
      return res
    }

    // ensure we update the workspace with new package id
    log.verbose(`Setup app successfully, ensuring built`)
    // build this app once
    const buildRes = await commandBuild(
      {
        projectRoot: join(appsDir, name),
        watch: false,
      },
      cmdOpts,
    )
    if (buildRes.type === 'error') {
      return buildRes
    }

    await orbitDesktop.workspaceManager.updateAppsAfterNewApp(opts.identifier)

    return {
      type: 'success',
      message: `Created app.`,
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
