import { command, loadOne, save } from '@o/bridge'
import { AppDefinition, useActiveSpace, useAppDefinition } from '@o/kit'
import { AppBit, AppModel, AuthAppCommand, InstallAppToWorkspaceCommand, SpaceModel, UserModel } from '@o/models'

import { newAppStore } from '../om/stores'

export function createNewAppBit(definition: AppDefinition): AppBit {
  return {
    target: 'app',
    identifier: definition.id,
    itemType: definition.itemType,
    name: definition.name,
    tabDisplay: 'plain',
    colors: ['#000', '#111'],
    token: '',
    data: {},
  }
}

export function useNewAppBit(identifier: string) {
  const definition = useAppDefinition(identifier)
  const [activeSpace] = useActiveSpace()
  return {
    ...createNewAppBit(definition),
    spaceId: activeSpace.id,
  }
}

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
    console.log('Creating a new app bit')
    try {
      const activeSpace = await getActiveSpace()
      const bit = {
        ...createNewAppBit(def),
        spaceId: activeSpace.id,
        space: activeSpace,
        name: newAppStore.app.name || def.name,
        colors: newAppStore.app.colors,
        ...((typeof newAppBit === 'object' && newAppBit) || null),
      }
      console.log('Saving new app', bit)
      await save(AppModel, bit)

      newAppStore.reset()
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
