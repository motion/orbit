import { command, loadOne, save } from '@o/bridge'
import { newEmptyAppBit } from '@o/helpers'
import { AppDefinition, getAppDefinition, useActiveSpace, useAppDefinition } from '@o/kit'
import { AppBit, AppInstallToWorkspaceCommand, AppModel, AuthAppCommand, SpaceModel, UserModel } from '@o/models'
import { BannerHandle, useBanner } from '@o/ui'
import { useCallback } from 'react'

import { newAppStore } from '../om/stores'

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

export function useInstallApp() {
  const banner = useBanner()
  return useCallback((a: AppDefinition, b?: Partial<AppBit> | true) => installApp(a, b, banner), [])
}

async function installApp(
  def: AppDefinition,
  newAppBit?: Partial<AppBit> | true,
  banner?: BannerHandle,
) {
  banner.set({
    message: `Installing app ${def.name}`,
  })

  if (def.auth) {
    banner.set({ message: `Waiting for authentication...` })

    const res = await command(AuthAppCommand, { authKey: def.auth })
    if (res.type === 'error') {
      console.error('Error, TODO show banner!')
      alert(`Error authenticating app: ${res.message}`)
      return res
    }

    banner.set({ message: `Authenticated!` })
    return res
  }

  const res = await command(AppInstallToWorkspaceCommand, { identifier: def.id })

  console.log('got response from install app command', res)

  if (res.type === 'error') {
    banner.set({
      type: 'error',
      message: res.message,
    })
    return res
  }

  // create AppBit
  if (newAppBit) {
    try {
      const activeSpace = await getActiveSpace()
      const bit = {
        ...newEmptyAppBit(def),
        spaceId: activeSpace.id,
        space: activeSpace,
        name: newAppStore.app.name || def.name,
        colors: newAppStore.app.colors,
        icon: def.icon,
        ...((typeof newAppBit === 'object' && newAppBit) || null),
      }
      console.log('Saving new app', newAppBit, bit)
      await save(AppModel, bit)

      newAppStore.reset()
    } catch (err) {
      const message = `Error saving AppBit ${err.message} ${err.stack}`
      banner.set({
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

  banner.set({
    type: 'success',
    message,
    timeout: 2500,
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
