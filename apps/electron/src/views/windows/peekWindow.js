// @flow
import * as React from 'react'
import * as Constants from '~/constants'
import { ipcMain } from 'electron'
import { view } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { isEqual } from 'lodash'

type Peek = {
  url: string,
  offsetTop: number,
}

@view.electron
export default class PeekWindow extends React.Component {
  state = {
    peeks: [{ key: 0, dimensions: [700, 5000], position: [0, 0] }],
    peek: {},
    lastPeek: {},
  }

  peekKey = 0

  componentWillMount() {
    this.listen()
  }

  peekSend = () => console.log('peekSend, not started yet')

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

  handlePeekMove = (tearPeek, position) => {
    const { key } = tearPeek
    const { peeks } = this.state
    const peek = peeks.find(p => p.key === key)
    const isPeek = key === this.peekKey
    if (!isEqual(peek.position, position)) {
      if (isPeek) {
        this.tearAway(tearPeek)
      } else {
        console.log('move', position)
        peek.position = position
        this.setState({ peeks })
      }
    }
  }

  tearAway = tearPeek => {
    this.peekKey++
    this.peekSend('peek-tear')
    const peeks = [
      // new hidden peek window
      { ...tearPeek, key: this.peekKey },
      // current torn window, keeps key
      tearPeek,
      // keep the rest
      ...this.state.peeks,
    ]
    this.setState({ peeks })
  }

  render({ appPosition }) {
    const windowProps = {
      file: `${Constants.APP_URL}/peek`,
      frame: false,
      hasShadow: false,
      background: '#00000000',
      webPreferences: Constants.WEB_PREFERENCES,
      transparent: true,
      show: true,
      alwaysOnTop: true,
    }

    console.log('this.state.peeks', this.state.peeks)

    return (
      <React.Fragment>
        {this.state.peeks.map((peek, index) => {
          // peek always in front
          const isPeek = index === 0
          console.log('window is', peek)
          const { key, dimensions } = peek
          let position
          if (isPeek) {
            const X_GAP = -12
            const Y_GAP = 0
            const [x, y] = appPosition
            const [width] = dimensions
            position = [x - width - X_GAP, y + Y_GAP]
          } else {
            position = peek.position
          }
          console.log('return', position, Window)
          return (
            <Window
              key={key}
              ref={isPeek ? this.handlePeekRef : _ => _}
              {...windowProps}
              size={dimensions}
              position={position}
              onMove={(...args) =>
                this.handlePeekMove({ key, dimensions, position }, ...args)
              }
            />
          )
        })}
      </React.Fragment>
    )
  }
}
