import { getGlobalConfig } from '@o/config'
import { resolveCommand } from '@o/mediator'
import { ToggleOrbitActionsCommand } from '@o/models'
import { Window } from '@o/reactron'
import { Electron } from '@o/stores'
import { useToggle } from '@o/ui'
import { useReaction } from '@o/use-store'
import { join } from 'path'
import React from 'react'

import { ROOT } from './constants'
import { getDefaultAppBounds } from './helpers/getDefaultAppBounds'

let toggleOpen

export const ToggleOrbitActionsResolver = resolveCommand(ToggleOrbitActionsCommand, async () => {
  toggleOpen()
})

const Config = getGlobalConfig()

export function OrbitActionsAppWindow() {
  const toggler = useToggle(false)
  toggleOpen = toggler.toggle

  const bounds = useReaction(() => {
    return getDefaultAppBounds(Electron.state.screenSize, {})
  })

  const showDevTools = useReaction(() => {
    return Electron.state.showDevTools['devtools']
  })

  if (!bounds.width) {
    return null
  }

  return (
    <Window
      show={toggler.val}
      file={`${Config.urls.server}/actions`}
      // webPreferences={{
      //   nodeIntegration: true,
      // }}
      titleBarStyle="customButtonsOnHover"
      defaultBounds={bounds}
      showDevTools={showDevTools}
      transparent
      background="#00000000"
      vibrancy="ultra-dark"
      hasShadow
      icon={join(ROOT, 'resources', 'icons', 'appicon.png')}
    />
  )
}
