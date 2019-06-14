import { command, loadOne, save } from '@o/bridge'
import { AppDefinition, getAppDefinition, useActiveSpace, useAppDefinition } from '@o/kit'
import {
  AppBit,
  AppInstallToWorkspaceCommand,
  AppModel,
  AuthAppCommand,
  SpaceModel,
  UserModel,
} from '@o/models'
import { BannerHandle } from '@o/ui'

import { newAppStore } from '../om/stores'

export function newEmptyAppBit(definition: AppDefinition): AppBit {
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
    ...newEmptyAppBit(definition),
    spaceId: activeSpace.id,
  }
}

export async function createAppBitInActiveSpace(
  appBit: Partial<AppBit> & Pick<AppBit, 'identifier'>,
) {
  const activeSpace = await getActiveSpace()
  const def = await getAppDefinition(appBit.identifier)
  const bit = {
    ...newEmptyAppBit(def),
    spaceId: activeSpace.id,
    space: activeSpace,
    name: newAppStore.app.name || def.name,
    colors: newAppStore.app.colors,
    ...appBit,
  }
  console.log('Saving new app', bit)
  await save(AppModel, bit)
}

export async function installApp(
  def: AppDefinition,
  newAppBit?: Partial<AppBit> | true,
  banner?: BannerHandle,
) {
  banner &&
    banner.show({
      message: `Installing app ${def.name}`,
    })

  if (def.auth) {
    banner && banner.setMessage(`Waiting for authentication...`)

    const res = await command(AuthAppCommand, { authKey: def.auth })
    if (res.type === 'error') {
      console.error('Error, TODO show banner!')
      alert(`Error authenticating app: ${res.message}`)
      return res
    }
    return res
  }
  const res = await command(AppInstallToWorkspaceCommand, { identifier: def.id })

  console.log('got response from install app command', res)

  if (res.type === 'error') {
    banner &&
      banner.show({
        type: 'error',
        message: res.message,
      })
    return res
  }

  // create AppBit
  if (newAppBit) {
    console.log('Creating a new app bit')
    try {
      const activeSpace = await getActiveSpace()
      const bit = {
        ...newEmptyAppBit(def),
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
      const message = `Error saving AppBit ${err.message} ${err.stack}`
      banner &&
        banner.show({
          type: 'error',
          message,
        })
      return {
        type: 'error' as const,
        message,
      }
    }
  } else {
    console.log('no new app bit, not adding app to workspace just did install')
  }

  const message = `Installed app!`

  banner &&
    banner.show({
      type: 'success',
      message,
    })

  return {
    type: 'success' as const,
    message,
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
