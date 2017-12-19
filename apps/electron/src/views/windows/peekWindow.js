// @flow
import * as React from 'react'
import * as Constants from '~/constants'
import { ipcMain } from 'electron'
import { view } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { isEqual, once } from 'lodash'
import * as Helpers from '~/helpers'

type PeekStateItem = {
  key: number,
  position: Array<number | boolean>,
  size: Array<number | boolean>,
  show: boolean,
}

type PeekWindowState = {
  peeks: Array<PeekStateItem>,
}

type PeekTarget = {
  url: string,
  top: number,
  left: number,
  width: number,
  height: number,
}

function getPeekPosition(peekTarget: PeekTarget) {
  console.log('getPeekPosition(peek)', peekTarget)
  const [peekW, peekH] = Constants.PEEK_DIMENSIONS
  const [screenW, screenH] = Helpers.getScreenSize()
  // find best position for peek
  let x = peekTarget.left - peekW
  let y = peekTarget.top - 20
  if (y + peekH > screenH) {
    console.log('should go upwards')
    // should go upwards
  }
  if (x + peekW > screenW) {
    console.log('should go rightwards')
    // should go rightwards
  }
  x = Math.round(x)
  y = Math.round(y)
  console.log('[x, y]', [x, y])
  return [x, y]
}

@view.electron
export default class PeekWindow extends React.Component<{}, PeekWindowState> {
  lastAppPositionMove = Date.now()
  peekKey = 0
  mounted = false

  state = {
    peeks: [
      {
        key: this.peekKey,
        size: Constants.PEEK_DIMENSIONS,
        position: [0, 0],
        show: false,
      },
    ],
    peek: {},
    lastPeek: {},
  }

  componentDidMount() {
    this.mounted = true
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
    this.on(ipcMain, 'peek', (event, peek: PeekTarget) => {
      const peeks = [...this.state.peeks]
      const curPeek = peeks[0]

      // update curPeek y
      // TODO: add conditional to ignore if same peek sent as last
      if (peek) {
        curPeek.position = getPeekPosition(peek)
        console.log('updated peek position', curPeek)
      }

      this.setState({
        peeks,
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

  handlePeekRef = ref => {
    if (ref) {
      this.peekRef = ref.window
    }
  }

  handleReadyToShow = peek => {
    if (!peek.show) {
      peek.show = true
      this.setState({ peeks: this.state.peeks })
    }
  }

  handlePeekMove = ({ key, size, position }, newPosition) => {
    if (!this.mounted) {
      return
    }
    const curPeek = { key, size, position }
    const { peeks } = this.state
    const peek = peeks.find(p => p.key === key)
    const updatePeekPosition = () => {
      peek.position = newPosition
      this.setState({ peeks })
    }
    // dont tear away if window moved recently
    if (Date.now() - this.lastAppPositionMove < 500) {
      updatePeekPosition()
      return
    }
    if (!isEqual(peek.position, newPosition)) {
      console.log('updating peek position', peek.position, newPosition)
      if (key === this.peekKey) {
        curPeek.position = position
        if (!this.handleTearAway(curPeek)) {
          updatePeekPosition()
        }
      } else {
        updatePeekPosition()
      }
    }
  }

  handleTearAway = curPeek => {
    const nextKey = this.peekKey + 1
    if (this.state.peeks.find(x => x.show === false)) {
      // havent shown the last peek yet
      return
    }
    if (this.state.peeks.find(x => x.key === nextKey)) {
      // bug called multiple times unecessarily
      return
    }
    const { lastPeek } = this.state
    if (!lastPeek || !lastPeek.offsetTop) {
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
    const position = [curPeekPos[0], lastPeek.offsetTop]
    console.log('handleTearAway', position)
    const peeks = [
      // new hidden peek window
      {
        ...curPeek,
        key: this.peekKey,
        show: false,
      },
      // current peek
      {
        ...curPeek,
        position,
        // set to real its real window size
        size: Constants.PEEK_DIMENSIONS,
        show: true,
        // attempt to sync tear better
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
          const { key, size } = peek
          const position = peek.position
          return (
            <Window
              key={key}
              showDevTools
              alwaysOnTop={isPeek || peek.alwaysOnTop}
              animatePosition
              show={peek.show}
              file={`${Constants.APP_URL}/peek?key=${key}`}
              ref={isPeek ? ref => this.handlePeekRef(ref, peek) : _ => _}
              onReadyToShow={() => this.handleReadyToShow(peek)}
              {...windowProps}
              size={size}
              position={position}
              onMove={([x, y]) =>
                this.handlePeekMove({ key, size, position }, [x, y])
              }
              onMoved={peek.isTearing ? this.handlePeekTornResize : _ => _}
            />
          )
        })}
      </React.Fragment>
    )
  }
}
