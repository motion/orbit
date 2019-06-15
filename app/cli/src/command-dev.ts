import { AppDevCloseCommand, AppDevOpenCommand, AppOpenWindowCommand } from '@o/models'
import { readJSON } from 'fs-extra'
import { join } from 'path'

import { watchBuildWorkspace } from './command-ws'
import { getOrbitDesktop } from './getDesktop'
import { addProcessDispose } from './processDispose'
import { reporter } from './reporter'
import { configStore } from './util/configStore'
import { getIsInMonorepo } from './util/getIsInMonorepo'

export type CommandDevOptions = { projectRoot: string }

export async function commandDev(options: CommandDevOptions) {
  let { mediator, didStartOrbit } = await getOrbitDesktop()

  if (!mediator) {
    process.exit(0)
  }

  if (didStartOrbit && (await getIsInMonorepo())) {
    await watchBuildWorkspace({
      workspaceRoot: configStore.lastActiveWorkspace.get(),
      mode: 'development',
      clean: false,
    })
  }

  const pkg = await readJSON(join(options.projectRoot, 'package.json'))
  const entry = pkg['ts:main'] || pkg.main

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
    console.log('Error opening app for dev', err.message, err.stack)
  }
  return
}
