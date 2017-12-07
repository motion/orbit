// @flow
import * as React from 'react'
import * as Constants from '~/constants'
import { ipcMain } from 'electron'
import { view } from '@mcro/black'
import { Window } from '@mcro/reactron'

type Peek = {
  url: string,
  offsetTop: number,
}

@view.electron
export default class PeekView extends React.Component {
  state = {
    peek: {},
    position: [0, 0],
    dimensions: [600, 450],
  }

  componentWillMount() {
    this.listen()
  }

  peekSend = null

  listen() {
    // peek stuff
    this.on(ipcMain, 'peek', (event, peek: Peek) => {
      this.setState({ peek })
      this.peekSend('peek-to', peek)
    })
    this.on(ipcMain, 'peek-start', event => {
      this.peekSend = (name, val) => event.sender.send(name, val)
    })
  }

  render({ appPosition }) {
    const X_GAP = 20
    const Y_GAP = 0
    const [x, y] = appPosition
    const { peek, dimensions } = this.state
    const [width] = dimensions
    const position = [x - width - X_GAP, y + peek.offsetTop || 0 + Y_GAP]

    return (
      <Window
        file={`${Constants.APP_URL}/peek`}
        webPreferences={Constants.WEB_PREFERENCES}
        transparent
        show
        alwaysOnTop
        size={this.state.dimensions}
        position={position}
      />
    )
  }
}
