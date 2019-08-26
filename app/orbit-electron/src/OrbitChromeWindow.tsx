import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import { Window } from '@o/reactron'
import { Desktop, Electron } from '@o/stores'
import { useStore } from '@o/use-store'
import * as React from 'react'

import { WEB_PREFERENCES } from './constants'

const Config = getGlobalConfig()
const log = new Logger('OrbitChromeWindow')

export function OrbitChromeWindow() {
  const [show, setShow] = React.useState(false)
  const electron = useStore(Electron)
  log.info(`electron.state.screenSize ${electron.state.screenSize.slice()}`)
  return (
    <Window
      alwaysOnTop={[true, 'floating', 2]}
      show={show}
      onReadyToShow={() => setShow(true)}
      // TODO useScreenSize()
      size={electron.state.screenSize.slice()}
      focus={false}
      ignoreMouseEvents={!Desktop.state.hoverState.menuHovered}
      focusable
      file={`${Config.urls.server}/chrome`}
      frame={false}
      hasShadow={false}
      showDevTools={electron.state.showDevTools[`menu`] || false}
      transparent
      background="#00000000"
      webPreferences={WEB_PREFERENCES}
      position={[0, 0]}
    />
  )
}
