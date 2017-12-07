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
    peekPosition: [100, 100],
  }

  componentWillMount() {
    this.listen()
  }

  listen() {
    // peek stuff
    let peekSend = null
    this.on(ipcMain, 'peek', (event, peek: Peek) => {
      this.setState({ peek })
      peekSend('peek-to', peek)
    })
    this.on(ipcMain, 'peek-start', event => {
      peekSend = (name, val) => event.sender.send(name, val)
    })
  }

  render() {
    return (
      <Window
        webPreferences={Constants.WEB_PREFERENCES}
        transparent
        show
        alwaysOnTop
        size={[600, 450]}
        file={`${Constants.APP_URL}/peek`}
        position={[
          this.state.peekPosition[0] + (this.state.peek.offsetTop || 0),
          this.state.peekPosition[1],
        ]}
      />
    )
  }
}
