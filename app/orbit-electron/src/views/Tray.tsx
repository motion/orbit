import * as React from 'react'
import { Tray } from '@mcro/reactron'
import { view } from '@mcro/black'
import Path from 'path'
import * as Constants from '../constants'
import { Electron, Desktop, App } from '@mcro/stores'

const getTitle = () => {
  if (Desktop.state.paused) {
    return 'Paused'
  }
  if (App.state.contextMessage) {
    return App.state.contextMessage
  }
}

@view.electron
export default class TrayEl extends React.Component {
  render() {
    return (
      <Tray
        onClick={() => {
          Electron.sendMessage(Desktop, Desktop.messages.TOGGLE_PAUSED)
        }}
        image={Path.join(
          Constants.ROOT_PATH,
          'resources',
          'icons',
          'orbitTemplate.png',
        )}
        title={getTitle()}
      />
    )
  }
}
