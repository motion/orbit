import * as React from 'react'
import { Tray } from '@mcro/reactron'
import { view } from '@mcro/black'
import Path from 'path'
import { Electron, Desktop, App } from '@mcro/stores'
import { getConfig } from '../config'

@view.electron
export default class TrayEl extends React.Component {
  render() {
    return (
      <Tray
        onClick={() => {
          Electron.sendMessage(Desktop, Desktop.messages.TOGGLE_PAUSED)
        }}
        image={Path.join(
          getConfig().directories.root,
          'resources',
          'icons',
          'orbitTemplate.png',
        )}
        title={App.state.contextMessage}
      />
    )
  }
}
