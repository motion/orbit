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
  lastAppPositionMove = Date.now()
  peekKey = 0

  state = {
    peeks: [
      {
        key: this.peekKey,
        dimensions: [700, 5000],
        position: [0, 0],
        show: false,
      },
    ],
    peek: {},
    lastPeek: {},
  }

  componentWillMount() {
    this.listen()
  }

  componentWillReceiveProps({ appPosition }) {
    if (!isEqual(appPosition, this.props.appPosition)) {
      this.lastAppPositionMove = Date.now()
    }
  }

  lastSent = this.state.peeks

  componentDidUpdate() {
    if (!isEqual(this.lastSent, this.state.peeks)) {
      this.props.onWindows(this.state.peeks)
      this.lastSent = this.state.peeks
    }
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
      this.peekSend = (name, val) => {
        try {
          event.sender.send(name, val)
        } catch (err) {
          console.log('peeksenderr', err)
        }
      }
    })
    this.on(ipcMain, 'peek-focus', () => {
      console.log('focusing peek')
      if (this.peekRef) {
        this.peekRef.focus()
      }
    })
    this.on(ipcMain, 'peek-close', (event, key) => {
      console.log('closing', key)
      const peeks = this.state.peeks.filter(p => `${p.key}` !== `${key}`)
      console.log('closed after peeks', peeks)
      this.setState({ peeks })
    })
  }

  handlePeekRef = (ref, peek) => {
    if (ref) {
      this.peekRef = ref.window
      // show once it gets ref
      if (!peek.show) {
        this.setTimeout(() => {
          peek.show = true
          this.setState({ peeks: this.state.peeks })
        }, 250)
      }
    }
  }

  handlePeekMove = (tearPeekProps, position) => {
    const { peeks } = this.state
    const { key } = tearPeekProps
    const peek = peeks.find(p => p.key === key)
    const updatePeekPosition = () => {
      peek.position = position
      this.setState({ peeks })
    }
    // dont tear away if window moved recently
    if (Date.now() - this.lastAppPositionMove < 500) {
      updatePeekPosition()
      return
    }
    if (!isEqual(peek.position, position)) {
      const isPeek = key === this.peekKey
      if (isPeek && !isEqual(peek.position, [0, 0])) {
        this.tearAway(tearPeekProps)
      } else {
        updatePeekPosition()
      }
    }
  }

  tearAway = tearPeekProps => {
    this.peekKey++
    if (this.state.peeks.find(x => x.key === this.peekKey)) {
      // likely called multiple times unecessarily
      return
    }
    console.log('sending peek tear')
    this.peekSend('peak-tear')
    const peeks = [
      // new hidden peek window
      { ...tearPeekProps, key: this.peekKey },
      // keep the rest
      ...this.state.peeks,
    ]
    this.setState({ peeks })
  }

  render({ appPosition }) {
    const windowProps = {
      frame: false,
      hasShadow: false,
      background: '#00000000',
      webPreferences: Constants.WEB_PREFERENCES,
      transparent: true,
    }

    console.log('this.state.peeks', this.state.peeks)

    return (
      <React.Fragment>
        {this.state.peeks.map((peek, index) => {
          // peek always in front
          const isPeek = index === 0
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
              alwaysOnTop={isPeek}
              show={peek.show}
              file={`${Constants.APP_URL}/peek?key=${key}`}
              ref={isPeek ? ref => this.handlePeekRef(ref, peek) : _ => _}
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
