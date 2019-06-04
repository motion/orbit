import { command } from '@o/bridge'
import { AppDefinition } from '@o/kit'
import { AuthAppCommand, InstallAppToWorkspaceCommand } from '@o/models'

export async function installApp(def: AppDefinition) {
  if (def.auth) {
    const res = await command(AuthAppCommand, { authKey: def.auth })

    if (res.type === 'error') {
      console.error('Error, TODO show banner!')
      alert(`Error authenticating app: ${res.message}`)
      return
    }
  }

  const res = await command(InstallAppToWorkspaceCommand, { identifier: def.id })
  if (res.type === 'error') {
    return res
  }
  return {
    type: 'success' as const,
    message: `Installed app!`,
  }
}
