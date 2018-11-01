import * as React from 'react'
import { view, compose, attach } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { Electron } from '@mcro/stores'
import { getGlobalConfig } from '@mcro/config'
import { WEB_PREFERENCES } from '../constants'

const Config = getGlobalConfig()

const decorator = compose(
  attach('electronStore'),
  view,
)
export const ChromeWindow = decorator(() => {
  return (
    <Window
      alwaysOnTop
      show
      focus={false}
      ignoreMouseEvents={!Electron.hoverState.peekHovered['menu']}
      focusable
      file={`${Config.urls.server}/chrome`}
      frame={false}
      hasShadow={false}
      showDevTools={Electron.state.showDevTools[`menu`] || false}
      transparent
      background="#00000000"
      webPreferences={WEB_PREFERENCES}
      position={[0, 0]}
      size={Electron.state.screenSize.slice()}
    />
  )
})
