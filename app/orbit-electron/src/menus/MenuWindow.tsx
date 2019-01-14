import * as React from 'react'
import { Window } from '@mcro/reactron'
import { Electron, Desktop } from '@mcro/stores'
import { getGlobalConfig } from '@mcro/config'
import { WEB_PREFERENCES } from '../constants'
import { observer } from 'mobx-react-lite'

const Config = getGlobalConfig()

export default observer(function MenuWindow() {
  const [show, setShow] = React.useState(false)
  return (
    <Window
      alwaysOnTop={[true, 'floating', 2]}
      show={show}
      onReadyToShow={() => setShow(true)}
      size={Electron.state.screenSize.slice()}
      focus={false}
      ignoreMouseEvents={!Desktop.hoverState.menuHovered}
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
})
