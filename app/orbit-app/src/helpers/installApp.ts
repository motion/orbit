import { command, loadOne, save } from '@o/bridge'
import { AppDefinition, getAppDefinition, useActiveSpace, useAppDefinition } from '@o/kit'
import { newEmptyAppBit } from '@o/libs'
import { AppBit, AppInstallToWorkspaceCommand, AppModel, AuthAppCommand, SpaceModel, UserModel } from '@o/models'
import { BannerHandle, useBanner } from '@o/ui'
import { useCallback } from 'react'

import { om } from '../om/om'
import { newAppStore } from '../om/stores'

export function useNewAppBit(identifier: string) {
  const definition = useAppDefinition(identifier)
  const [activeSpace] = useActiveSpace()
  return {
    ...newEmptyAppBit(definition!),
    spaceId: activeSpace.id,
  }
}

export async function createAppBitInActiveSpace(
  appBit: Partial<AppBit> & Pick<AppBit, 'identifier'>,
) {
  try {
    const activeSpace = await getActiveSpace()
    const def = await getAppDefinition(appBit.identifier)
    const bit = {
      ...(def ? newEmptyAppBit(def) : null),
      spaceId: activeSpace.id,
      space: activeSpace,
      name: appBit.name || newAppStore.app.name || def.name,
      colors: newAppStore.app.colors,
      ...appBit,
    }
    console.log('Saving new app', bit)
    await save(AppModel, bit)
  } catch (err) {
    console.error(err.message, err.stack)
    alert(`Error creating new app ${err.message}`)
  }
}

export function useInstallApp() {
  const banner = useBanner()
  return useCallback(
    (a: AppDefinition, b: Partial<AppBit> | true = true) => installApp(a, b, banner),
    [],
  )
}

async function installApp(
  def: AppDefinition,
  newAppBit: Partial<AppBit> | true,
  banner: BannerHandle,
) {
  banner.set({
    message: `Installing app ${def.name}`,
    timeout: 3,
  })

  if (def.auth) {
    banner.set({
      message: `Waiting for authentication...`,
      timeout: 6,
    })

    const res = await command(AuthAppCommand, {
      authKey: def.auth,
      identifier: def.id,
    })

    if (res.type === 'error') {
      console.error('Error, TODO show banner!')
      alert(`Error authenticating app: ${res.message}`)
      banner.set({
        type: 'error',
        message: res.message,
        timeout: 4,
      })
      return res
    }

    banner.set({ message: `Authenticated!`, timeout: 3 })
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

  let appBit

  // create AppBit
  if (newAppBit) {
    try {
      const activeSpace = await getActiveSpace()
      const filledInBit =
        newAppBit === true ? newEmptyAppBit(def) : { ...newEmptyAppBit(def), ...newAppBit }
      appBit = {
        ...filledInBit,
        spaceId: activeSpace.id,
        space: activeSpace,
        name: filledInBit.name || newAppStore.app.name || def.name,
        colors: filledInBit.colors || newAppStore.app.colors,
        icon: def.icon,
        ...((typeof newAppBit === 'object' && newAppBit) || null),
      }
      console.log('Saving new app', newAppBit, appBit)
      // re-assign here to get the id
      appBit = await save(AppModel, appBit)

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
    timeout: 2,
  })

  if (appBit) {
    setTimeout(() => {
      om.actions.router.showAppPage({ id: appBit.id })
    }, 500)
  }

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
