import { AppOpenWorkspaceCommand } from '@o/models'

import { getOrbitDesktop } from './getDesktop'

export async function commandWs(options: { workspaceRoot: string }) {
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
  }
  return
}
