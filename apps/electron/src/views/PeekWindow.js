// @flow
import * as React from 'react'
import * as Constants from '~/constants'
import { view, watch } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { isEqual, memoize } from 'lodash'
import * as Helpers from '~/helpers'
import Screen from '@mcro/screen'

const idFn = _ => _
const PEEK_ANIMATE_MS = 350
const INITIAL_SIZE = [560, 450]

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

@view.provide({
  store: class PeekStore {
    @watch
    linesBoundingBox = () => {
      const { linePositions } = Screen.desktopState
      if (!linePositions) return null
      let minX = 100000
      let maxX = 0
      let minY = 100000
      let maxY = 0
      // found place for window to go
      for (const [lx, ly, lw, lh] of linePositions) {
        if (lx + lw > maxX) maxX = lx + lw
        if (lx < minX) minX = lx
        if (ly < minY) minY = ly
        if (ly + lh > maxY) maxY = ly + lh
      }
      return { left: minX, top: minY, width: maxX - minX, height: maxY - minY }
    }
  },
})
@view.electron
export default class PeekWindow extends React.Component<{}, PeekWindowState> {
  peekRefs = {}
  peekKey = 0
  mounted = false
  isAnimatingPeek = true

  state = {
    windows: [
      {
        key: this.peekKey,
        size: INITIAL_SIZE,
        position: [0, 0],
        show: false,
      },
    ],
    lastTarget: null,
    wasShowing: false,
  }

  componentDidMount() {
    this.mounted = true
    // this.positionPeekBasedOnLines()
    this.positionPeekBasedOnWindow()
    this.watch(function watchPeekClose() {
      const key = Screen.appState.peekClose
      if (!key) return
      const windows = this.state.windows.filter(p => `${p.key}` !== `${key}`)
      this.setState({ windows })
    })
  }

  componentWillUpdate(nextProps, nextState) {
    if (!isEqual(nextState, this.state)) {
      Screen.setState({ peekState: nextState })
    }
  }

  peekPosition({ left, top, width, height }: PeekTarget) {
    let [peekW] = INITIAL_SIZE
    const [screenW /*, screenH*/] = Helpers.getScreenSize()
    const leftSpace = left
    const rightSpace = screenW - (left + width)
    const peekOnLeft = leftSpace > rightSpace
    let x
    let y = top
    if (peekOnLeft) {
      x = left - peekW
      if (peekW > leftSpace) {
        peekW = leftSpace
        x = 0
      }
    } else {
      x = left + width
      if (peekW > rightSpace) {
        peekW = rightSpace
      }
    }
    return {
      position: [Math.round(x), Math.round(y)],
      size: [peekW, height],
      arrowTowards: peekOnLeft ? 'right' : 'left',
    }
  }

  positionPeekBasedOnWindow = () => {
    const appTarget = ({ offset, bounds }) => {
      if (!offset || !bounds) return null
      const [left, top] = offset
      const [width, height] = bounds
      return { top, left, width, height }
    }
    this.react(
      () => [
        appTarget(Screen.desktopState.appState || {}),
        this.props.store.linesBoundingBox,
      ],
      ([appTarget, linesTarget]) => {
        const box = linesTarget || appTarget
        if (!box) return
        const [peek, ...rest] = this.state.windows
        const newPeek = {
          ...peek,
          ...this.peekPosition(box),
        }
        if (!isEqual(newPeek, peek)) {
          this.setState({ windows: [newPeek, ...rest] })
        }
      },
    )
  }

  peekSend = () => console.log('peekSend, not started yet')

  handlePeekRef = memoize(peek => ref => {
    if (!ref) return
    if (this.peekRefs[peek.key]) return
    this.peekRefs[peek.key] = ref.window
    this.props.onPeekRef(ref.window)
    // make sure its in front of the ora window
    if (!peek.isTorn) {
      this.peekRefs[peek.key].focus()
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
      console.log('want to tear this damn peek 123')
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
    return (
      <React.Fragment>
        {this.state.windows.map((peek, index) => {
          // peek always in front
          const isAttached = index === 0
          return (
            <Window
              key={peek.key}
              showDevTools={
                isAttached ? Screen.state.showDevTools.peek : peek.showDevTools
              }
              alwaysOnTop={isAttached || peek.alwaysOnTop}
              animatePosition={this.state.wasShowing}
              show={peek.show}
              file={`${Constants.APP_URL}/peek?key=${peek.key}`}
              ref={isAttached ? this.handlePeekRef(peek) : idFn}
              onReadyToShow={this.handleReadyToShow(peek)}
              {...windowProps}
              size={peek.size}
              position={peek.position}
              onMove={this.handlePeekMove(peek)}
            />
          )
        })}
      </React.Fragment>
    )
  }
}
