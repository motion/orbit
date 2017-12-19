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
  const [peekW, peekH] = Constants.PEEK_DIMENSIONS
  const [screenW, screenH] = Helpers.getScreenSize()
  // find best position for peek
  let x = peekTarget.left - peekW
  let y = peekTarget.top - 20
  let arrowDirection = 'right'

  // TODO: while(!goodFit) { findNextFit(); testFit(); }

  if (x < 0) {
    x = peekTarget.left + peekTarget.width
    arrowDirection = 'left'
  } else if (x + peekW > screenW) {
    console.log('should go left')
  }
  if (y < 0) {
    console.log('should go down')
  } else if (y + peekH > screenH) {
    y = peekTarget.top - peekH
    arrowDirection = 'down'
  }
  x = Math.round(x)
  y = Math.round(y)
  return {
    position: [x, y],
    arrowDirection,
  }
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
    lastTarget: {},
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
    this.on(ipcMain, 'peek-target', (event, target: PeekTarget) => {
      const peeks = [...this.state.peeks]
      const curPeek = peeks[0]

      // update curPeek y
      // TODO: add conditional to ignore if same peek sent as last
      if (target) {
        const { position, arrowDirection } = getPeekPosition(target)
        curPeek.position = position
        curPeek.arrowDirection = arrowDirection
        console.log('updated peek position', curPeek)
      }

      this.setState({
        peeks,
        target,
        // lastTarget never is the null peek
        lastTarget: target || this.state.target,
      })
      this.peekSend('peek-to', target)
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
    console.log('handlePeekMove', ({ key, size, position }, newPosition))
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
      console.log('handlePeekMove.UPDATE', peek.position, newPosition)
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
    // TODO this is old code, need new way to handle tear
    return false

    const nextKey = this.peekKey + 1
    if (this.state.peeks.find(x => x.show === false)) {
      // havent shown the last peek yet
      return
    }
    if (this.state.peeks.find(x => x.key === nextKey)) {
      // bug called multiple times unecessarily
      return
    }
    const { lastTarget } = this.state
    if (!lastTarget || !lastTarget.offsetTop) {
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
    const position = [curPeekPos[0], lastTarget.offsetTop]
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
        show: true,
      },
      // keep the rest
      ...otherPeeks,
    ]
    this.setState({ peeks })
    return true
  }

  render() {
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
            />
          )
        })}
      </React.Fragment>
    )
  }
}
