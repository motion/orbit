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
export default class PeekWindow extends React.Component {
  state = {
    peek: {},
    lastPeek: {},
    position: [0, 0],
    dimensions: [700, 5000],
  }

  componentWillMount() {
    this.listen()
  }

  peekSend = null

  listen() {
    // peek stuff
    this.on(ipcMain, 'peek', (event, peek: Peek) => {
      this.setState({
        peek,
        // lastPeek never is the null peek
        lastPeek: peek || this.state.peek,
      })
      this.peekSend('peek-to', peek)
    })
    this.on(ipcMain, 'peek-start', event => {
      this.peekSend = (name, val) => event.sender.send(name, val)
    })
    this.on(ipcMain, 'peek-focus', () => {
      console.log('focusing peek')
      if (this.peekRef) {
        this.peekRef.focus()
      }
    })
  }

  handlePeekRef = ref => {
    if (ref) {
      this.peekRef = ref.window
    }
  }

  render({ appPosition }) {
    // overlap a little
    const X_GAP = -12
    const Y_GAP = 0
    const [x, y] = appPosition
    const { dimensions } = this.state
    const [width] = dimensions
    const position = [x - width - X_GAP, y + Y_GAP]

    return (
      <Window
        ref={this.handlePeekRef}
        file={`${Constants.APP_URL}/peek`}
        frame={false}
        hasShadow={false}
        background="#00000000"
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
