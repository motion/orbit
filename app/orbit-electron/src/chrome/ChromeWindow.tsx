import * as React from 'react'
import { view } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { Electron } from '@mcro/stores'
import { getGlobalConfig } from '@mcro/config'
import { WEB_PREFERENCES } from '../constants'

const Config = getGlobalConfig()

@view
export class ChromeWindow extends React.Component {
  render() {
    return (
      <Window
        alwaysOnTop={[true, 'floating', 2]}
        show={!!Electron.state.screenSize[0]}
        size={Electron.state.screenSize.slice()}
        focus={false}
        ignoreMouseEvents={!Electron.hoverState.menuHovered}
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
}
