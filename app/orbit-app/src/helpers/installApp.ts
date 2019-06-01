import { command } from '@o/bridge'
import { getGlobalConfig } from '@o/config'
import { AppDefinition } from '@o/kit'
import { InstallAppToWorkspaceCommand, OpenCommand, SetupProxyCommand } from '@o/models'

export async function installApp(app: AppDefinition) {
  const res = await command(InstallAppToWorkspaceCommand, { identifier: app.id })
  if (res.type === 'error') {
    return res
  }
  if (await command(SetupProxyCommand)) {
    const url = `${getGlobalConfig().urls.auth}/auth/${app.id}`
    console.log('proxy setup success, opening...', url)
    await command(OpenCommand, { url })
  }
  return {
    type: 'success' as const,
    message: `Installed app!`,
  }
}
