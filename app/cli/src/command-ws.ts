import { AppWorkspaceCommand, CommandWsOptions } from '@o/models'
import { basename, join } from 'path'
import replaceInFile from 'replace-in-file'

import { copyTemplate, isInWorkspace } from './command-new'
import { getOrbitDesktop } from './getDesktop'
import { reporter } from './reporter'

export async function commandWs(options: CommandWsOptions) {
  if (!(await isInWorkspace(options.workspaceRoot))) {
    reporter.panic(
      `Not in an orbit workspace, be sure package.json has "config": { "orbitWorkspace": true }`,
    )
  }
  reporter.info(`Running command ws mode${options.dev ? ' in dev mode' : ''}`)

  // orbit ws new [name]
  if (options.action === 'new') {
    // since we are handling multiple commands, we transform the path into a name here
    const name = basename(options.workspaceRoot) || 'new-workspace'
    const projectRoot = join(options.workspaceRoot, '..')
    return await copyTemplate(
      {
        projectRoot,
        name,
        template: 'workspace',
      },
      {
        async preInstall({ path }) {
          await replaceInFile({
            files: join(path, '**'),
            from: ['$WORKSPACE_NAME'],
            to: [name],
          })
        },
      },
    )
  }

  const shouldBuild = options.action === 'build'
  const { mediator } = await getOrbitDesktop({
    singleUseMode: shouldBuild,
  })
  try {
    reporter.info(shouldBuild ? `Building workspace` : `Running workspace`)
    // this will tell orbit to look for this workspace and re-run the cli
    // we centralize all commands through orbit so we don't want to do it directly here
    await mediator.command(AppWorkspaceCommand, options, {
      timeout: 1000 * 60 * 3,
      onMessage: reporter.info,
    })
    if (shouldBuild) {
      process.exit(0)
    }
  } catch (err) {
    reporter.panic(`Error opening app for dev ${err.message}\n${err.stack}`)
  }
}
