// @flow
import * as React from 'react'
import * as Constants from '~/constants'
import { ipcMain } from 'electron'
import { view } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { isEqual } from 'lodash'
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
  const halfHeight = screenH / 2
  const halfWidth = screenW / 2

  // start: target is to right
  let x = peekTarget.left - peekW
  let y = peekTarget.top - 20
  let arrowTowards = 'right'

  if (x < halfWidth) {
    // target is to left
    x = peekTarget.left + peekTarget.width
    arrowTowards = 'left'
  }
  if (y + peekH > screenH) {
    // target is below
    arrowTowards = 'top'
  }
  x = Math.round(x)
  y = Math.round(y)
  return {
    position: [x, y],
    arrowTowards,
  }
}

@view.electron
export default class PeekWindow extends React.Component<{}, PeekWindowState> {
  lastAppPositionMove = Date.now()
  peekKey = 0
  mounted = false
  isAnimatingPeek = true

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
    lastTarget: null,
    wasShowing: false,
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
      const peek = peeks[0]

      // update peek y
      // TODO: add conditional to ignore if same peek sent as last
      if (target) {
        const { position, arrowTowards } = getPeekPosition(target)
        console.log('getPeekPosition', { position, arrowTowards })
        // peek.hasNewTarget = true
        peek.position = position
        peek.arrowTowards = arrowTowards
      }

      const wasShowing = !!this.state.lastTarget
      console.log('wasShowing', wasShowing)

      // this handles avoiding tears during animation
      clearTimeout(this.animatePeekTimeout)
      this.isAnimatingPeek = true
      // need to figure out how long electron animates for
      // for now, be conservative
      this.animatePeekTimeout = this.setTimeout(() => {
        this.isAnimatingPeek = false
      }, 350)

      this.setState({
        peeks,
        target,
        wasShowing,
        lastTarget: this.state.target,
      })
      this.peekSend('peek-to', { target, peek })
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
      // make sure its in front of the ora window
      // console.log('handlepeek ref, focusing')
      // this.peekRef.focus()
    }
  }

  handleReadyToShow = peek => {
    if (!peek.show) {
      peek.show = true
      this.setState({ peeks: this.state.peeks })
    }
  }

  handlePeekMove = (peek, newPosition) => {
    if (!this.mounted) {
      return
    }
    if (!this.isAnimatingPeek && !peek.isTorn) {
      this.isAnimatingPeek = true // bug test fix
      peek.position = newPosition
      this.tearPeek()
    }
  }

  tearPeek = () => {
    this.peekSend('peek-tear')
    const [peek, ...otherPeeks] = this.state.peeks
    this.peekKey++
    const peeks = [
      // new hidden peek window
      {
        ...peek,
        key: this.peekKey,
        show: false,
      },
      // current peek
      {
        ...peek,
        show: true,
      },
      // keep the rest
      ...otherPeeks,
    ]
    this.setState({ peeks })
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
          const isAttached = index === 0
          const { key, size } = peek
          const position = peek.position
          return (
            <Window
              key={key}
              showDevTools={true || peek.showDevTools}
              alwaysOnTop={isAttached || peek.alwaysOnTop}
              animatePosition={this.state.wasShowing}
              show={peek.show}
              file={`${Constants.APP_URL}/peek?key=${key}`}
              ref={isAttached ? ref => this.handlePeekRef(ref, peek) : _ => _}
              onReadyToShow={() => this.handleReadyToShow(peek)}
              {...windowProps}
              size={size}
              position={[position[0], position[1]]}
              onMove={([x, y]) => this.handlePeekMove(peek, [x, y])}
            />
          )
        })}
      </React.Fragment>
    )
  }
}
