import { AppOpenWorkspaceCommand } from '@o/models'

import { getOrbitDesktop } from './getDesktop'

type CommandWSOptions = { workspaceRoot: string }

export async function commandWs(options: CommandWSOptions) {
  let orbitDesktop = await getOrbitDesktop()

  if (!orbitDesktop) {
    process.exit(0)
  }

  try {
    await orbitDesktop.command(AppOpenWorkspaceCommand, {
      path: options.workspaceRoot,
    })
  } catch (err) {
    console.log('Error opening app for dev', err.message, err.stack)
    return
  }
  return
}
