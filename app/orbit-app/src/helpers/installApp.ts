import { command, loadOne, save } from '@o/bridge'
import { AppDefinition } from '@o/kit'
import { AppBit, AppModel, AuthAppCommand, InstallAppToWorkspaceCommand, SpaceModel, UserModel } from '@o/models'

export async function installApp(def: AppDefinition, newAppBit?: Partial<AppBit> | true) {
  if (def.auth) {
    const res = await command(AuthAppCommand, { authKey: def.auth })
    if (res.type === 'error') {
      console.error('Error, TODO show banner!')
      alert(`Error authenticating app: ${res.message}`)
      return res
    }
    return res
  }
  const res = await command(InstallAppToWorkspaceCommand, { identifier: def.id })
  if (res.type === 'error') {
    return res
  }

  // create AppBit
  if (newAppBit) {
    try {
      const activeSpace = await getActiveSpace()
      let bit: AppBit = {
        target: 'app',
        identifier: def.id,
        spaceId: activeSpace.id,
        space: activeSpace,
        name: def.name,
        colors: ['black', 'black'],
        tabDisplay: 'plain',
        itemType: def.itemType,
        token: '',
        data: {},
      }
      if (typeof newAppBit === 'object') {
        bit = {
          ...bit,
          ...newAppBit,
        }
      }
      await save(AppModel, bit)
    } catch (err) {
      return {
        type: 'error' as const,
        message: `Error saving AppBit ${err.message} ${err.stack}`,
      }
    }
  }

  return {
    type: 'success' as const,
    message: `Installed app!`,
  }
}

export async function getActiveSpace() {
  const user = await loadOne(UserModel, {})
  return await loadOne(SpaceModel, {
    args: {
      where: {
        id: user.activeSpace,
      },
    },
  })
}
