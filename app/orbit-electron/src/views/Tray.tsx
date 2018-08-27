import * as React from 'react'
import { Tray } from '@mcro/reactron'
import { view } from '@mcro/black'
import Path from 'path'
import { Electron, App } from '@mcro/stores'

const image = Path.join(
  __dirname,
  '..',
  '..',
  'resources',
  'icons',
  'orbitTemplate.png',
)

@view.electron
export default class TrayEl extends React.Component {
  render() {
    return (
      <Tray
        onClick={() => {
          Electron.sendMessage(App, App.messages.TOGGLE_DOCKED)
        }}
        image={image}
        title={App.state.contextMessage}
      />
    )
  }
}
