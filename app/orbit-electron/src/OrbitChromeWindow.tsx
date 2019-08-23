import { getGlobalConfig } from '@o/config'
import { Window } from '@o/reactron'
import { Electron } from '@o/stores'
import * as React from 'react'

import { WEB_PREFERENCES } from './constants'

const Config = getGlobalConfig()

export function OrbitChromeWindow() {
  const [show, setShow] = React.useState(false)
  return (
    <Window
      alwaysOnTop={[true, 'floating', 2]}
      show={show}
      onReadyToShow={() => setShow(true)}
      // TODO useScreenSize()
      size={Electron.state.screenSize.slice()}
      focus={false}
      // ignoreMouseEvents={!Desktop.hoverState.menuHovered}
      focusable
      file={`${Config.urls.server}/chrome`}
      frame={false}
      hasShadow={false}
      showDevTools={Electron.state.showDevTools[`menu`] || false}
      transparent
      background="#00000000"
      webPreferences={WEB_PREFERENCES}
      position={[0, 0]}
    />
  )
}
