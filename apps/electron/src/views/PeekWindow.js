// @flow
import * as React from 'react'
import * as Constants from '~/constants'
import { view, watch } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { isEqual, memoize } from 'lodash'
import * as Helpers from '~/helpers'
import Screen from '@mcro/screen'

const idFn = _ => _

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
  key: string,
  top: number,
  left: number,
  width: number,
  height: number,
}

function getPeekPosition(peekTarget: PeekTarget) {
  const [peekW, peekH] = Constants.PEEK_DIMENSIONS
  const [screenW, screenH] = Helpers.getScreenSize()
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
    windows: [
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
    this.watchHovers()
  }

  @watch
  alignPeekWithLinePositions = [
    () => Screen.desktopState.linePositions || [],
    lines => {
      console.log('i see line positions')
      let minX = 100000
      let maxX = 0
      let minY = 100000
      let maxY = 0
      // found place for window to go
      for (const [lx, ly, lw, lh] of lines) {
        if (lx + lw > maxX) maxX = lx + lw
        if (lx < minX) minX = lx
        if (ly < minY) minY = ly
        if (ly + lh > maxY) maxY = ly + lh
      }
      const linesBoundingBox = [minX, minY, maxX - minX, maxY - minY]
      console.log('got line bounding box!', linesBoundingBox)
      // Screen.setState({ linesBoundingBox })
    },
    tru,
  ]

  componentWillReceiveProps({ appPosition }) {
    if (!isEqual(appPosition, this.props.appPosition)) {
      this.lastAppPositionMove = Date.now()
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (!isEqual(nextState, this.state)) {
      // update electronApp.peekState
      Screen.setState({ peekState: this.state })
    }
  }

  peekSend = () => console.log('peekSend, not started yet')

  watchHovers() {
    this.react(
      () => Screen.appState.hoveredWord,
      hoveredWord => {
        const windows = [...this.state.windows]
        const peek = windows[0]
        console.log('got peek', hoveredWord, 'for peek', peek)

        // update peek y
        // TODO: add conditional to ignore if same peek sent as last
        if (hoveredWord) {
          const { position, arrowTowards } = getPeekPosition(hoveredWord)
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
          windows,
          wasShowing,
          lastTarget: this.state.target,
          target: hoveredWord,
        })
      },
    )

    this.watch(function() {
      const key = Screen.appState.peekClose
      if (!key) return
      const windows = this.state.windows.filter(p => `${p.key}` !== `${key}`)
      this.setState({ windows })
    })
  }

  handlePeekRef = memoize(peek => ref => {
    if (ref) {
      this.peekRef = ref.window
      // make sure its in front of the ora window
      if (!peek.isTorn) {
        this.peekRef.focus()
      }
    }
  })

  handleReadyToShow = memoize(peek => () => {
    if (!peek.show) {
      peek.show = true
      this.setState({ windows: this.state.windows })
    }
  })

  handlePeekMove = memoize(peek => newPosition => {
    if (!this.mounted) {
      return
    }
    if (!this.isAnimatingPeek && !peek.isTorn) {
      this.isAnimatingPeek = true // bug test fix
      peek.position = newPosition
      this.tearPeek()
    } else {
      peek.position = newPosition
      this.setState({})
    }
  })

  tearPeek = () => {
    if (true) {
      console.log('want to tear this damn peek')
      return
    }
    const [peek, ...otherPeeks] = this.state.windows
    this.peekKey++
    const windows = [
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
    this.setState({ windows })
  }

  render() {
    if (Screen.appState.disablePeek) {
      return null
    }

    const windowProps = {
      frame: false,
      hasShadow: false,
      background: '#00000000',
      webPreferences: Constants.WEB_PREFERENCES,
      transparent: true,
    }

    // console.log('windows = ', JSON.stringify(this.state.windows))

    return (
      <React.Fragment>
        {this.state.windows.map((peek, index) => {
          // peek always in front
          const isAttached = index === 0
          const { key, size } = peek
          const position = peek.position
          return (
            <Window
              key={key}
              showDevTools={
                isAttached ? Screen.state.showDevTools.peek : peek.showDevTools
              }
              alwaysOnTop={isAttached || peek.alwaysOnTop}
              animatePosition={this.state.wasShowing}
              show={peek.show}
              file={`${Constants.APP_URL}/peek?key=${key}`}
              ref={isAttached ? this.handlePeekRef(peek) : idFn}
              onReadyToShow={this.handleReadyToShow(peek)}
              {...windowProps}
              size={size}
              position={[position[0], position[1]]}
              onMove={this.handlePeekMove(peek)}
            />
          )
        })}
      </React.Fragment>
    )
  }
}
