import * as React from 'react'
import { Tray, TrayItem } from '@mcro/reactron'
import { view } from '@mcro/black'
import Path from 'path'
import { Electron, App } from '@mcro/stores'

const image = Path.join(__dirname, '..', '..', 'resources', 'icons', 'orbitTemplate.png')

@view.electron
export default class TrayEl extends React.Component {
  render() {
    return (
      <Tray image={image} title={App.state.contextMessage}>
        <TrayItem
          label={App.orbitState.docked ? 'Hide' : 'Show'}
          onClick={() => Electron.sendMessage(App, App.messages.TOGGLE_SHOWN)}
        />
        <TrayItem
          label="Settings"
          onClick={() => Electron.sendMessage(App, App.messages.TOGGLE_SETTINGS)}
        />
        <TrayItem label="Quit" onClick={() => process.exit(0)} />
      </Tray>
    )
  }
}
