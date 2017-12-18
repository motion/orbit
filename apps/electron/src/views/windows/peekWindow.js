// @flow
import * as React from 'react'
import * as Constants from '~/constants'
import { ipcMain } from 'electron'
import { view } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { isEqual, once } from 'lodash'

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
        dimensions: [Constants.PEEK_DIMENSIONS[0], 5000],
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
      const peeks = this.state.peeks.filter(p => `${p.key}` !== `${key}`)
      this.setState({ peeks })
    })
  }

  handlePeekRef = (ref, peek) => {
    if (ref) {
      this.peekRef = ref.window
      // show once it gets ref
      if (!peek.show) {
        // show after a little bit, because it flashes white weirdly
        this.setTimeout(() => {
          peek.show = true
          this.setState({ peeks: this.state.peeks })
        }, 500)
      }
    }
  }

  handlePeekMove = (curPeek, position) => {
    const { peeks } = this.state
    const { key } = curPeek
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
        curPeek.position = position
        const hasTorn = this.tearAway(curPeek)
        if (!hasTorn) {
          updatePeekPosition()
        }
      } else {
        updatePeekPosition()
      }
    }
  }

  tearAway = curPeek => {
    const nextKey = this.peekKey + 1
    if (this.state.peeks.find(x => x.show === false)) {
      // havent shown the last peek yet
      return
    }
    if (this.state.peeks.find(x => x.key === nextKey)) {
      // bug called multiple times unecessarily
      return
    }
    this.peekKey = nextKey
    console.log('sending peek tear')
    this.peekSend('peek-tear')
    this.peekSendTorn = once(() => this.peekSend('peek-torn'))
    this.peekTearing = curPeek.key
    const [curPeekOld, ...otherPeeks] = this.state.peeks
    // discard curPeekOld
    const curPeekPos = curPeek.position
    const { lastPeek } = this.state
    const position = [curPeekPos[0], lastPeek.offsetTop]
    const peeks = [
      // new hidden peek window
      {
        ...curPeek,
        key: this.peekKey,
        show: false,
      },
      // current peek, make dimensions short now
      {
        ...curPeek,
        position,
        dimensions: Constants.PEEK_DIMENSIONS,
        show: true,
        isTearing: true,
      },
      // keep the rest
      ...otherPeeks,
    ]
    this.setState({ peeks })
    return true
  }

  handlePeekTornResize = () => {
    this.peekSendTorn()
    // no need to set state, itll pick up next render
    this.state.peeks.find(p => p.key === this.peekTearing).isTearing = false
    this.peekTearing = null
  }

  render({ appPosition }) {
    const windowProps = {
      frame: false,
      hasShadow: false,
      background: '#00000000',
      webPreferences: Constants.WEB_PREFERENCES,
      transparent: true,
    }

    console.log('peeks = ', JSON.stringify(this.state.peeks))

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
          return (
            <Window
              key={key}
              alwaysOnTop={isPeek || peek.alwaysOnTop}
              show={peek.show}
              file={`${Constants.APP_URL}/peek?key=${key}`}
              ref={isPeek ? ref => this.handlePeekRef(ref, peek) : _ => _}
              {...windowProps}
              size={dimensions}
              position={position}
              onMove={(...args) =>
                this.handlePeekMove({ key, dimensions, position }, ...args)
              }
              onMoved={peek.isTearing ? this.handlePeekTornResize : _ => _}
            />
          )
        })}
      </React.Fragment>
    )
  }
}
