import * as React from 'react'
import { Tray } from '@mcro/reactron'
import { view } from '@mcro/black'
import Path from 'path'
import { Electron, App } from '@mcro/stores'
import { getGlobalConfig } from '@mcro/config'

const Config = getGlobalConfig()

@view.electron
export default class TrayEl extends React.Component {
  render() {
    return (
      <Tray
        onClick={() => {
          Electron.sendMessage(App, App.messages.TOGGLE_DOCKED)
        }}
        image={Path.join(
          Config.paths.root,
          'resources',
          'icons',
          'orbitTemplate.png',
        )}
        title={App.state.contextMessage}
      />
    )
  }
}
