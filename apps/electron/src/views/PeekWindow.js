// @flow
import * as React from 'react'
import * as Constants from '~/constants'
import { view } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { isEqual, memoize } from 'lodash'
import * as Helpers from '~/helpers'
import { App, Desktop, Electron, Swift } from '@mcro/all'

const idFn = _ => _
const PAD = 15
const INITIAL_SIZE = [350, 420]
const log = debug('PeekWindow')

const peekPosition = ({ left, top, width, height }: PeekTarget) => {
  const EDGE_PAD = 20
  let [peekW] = INITIAL_SIZE
  const [screenW, screenH] = Helpers.getScreenSize()
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
  if (height + y + EDGE_PAD > screenH) {
    // height = screenH - EDGE_PAD - y
    log(`too big, adjusting height ${height} screenH ${screenH}`)
  }
  return {
    position: [Math.round(x), Math.round(y)],
    size: [peekW, height],
    arrowTowards: peekOnLeft ? 'right' : 'left',
  }
}

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
    peekRefs = {}
    focused = false
    get peek() {
      return (
        Electron.state.peekState.windows && Electron.state.peekState.windows[0]
      )
    }
    get peekRef() {
      return this.peekRefs[this.peek && this.peek.key]
    }

    willMount() {
      this.watchMouseForPeekFocus()
    }

    handlePeekRef = memoize(peek => ref => {
      if (!ref) return
      if (this.peekRefs[peek.key]) return
      this.peekRefs[peek.key] = ref.window
      // make sure its in front of the ora window
      if (!peek.isTorn) {
        this.peekRefs[peek.key].focus()
      }
    })

    get linesBoundingBox() {
      const { linePositions } = Desktop.state
      if (!linePositions) return null
      let left = 100000
      let maxX = 0
      let top = 100000
      let maxY = 0
      // found place for window to go
      for (const [lx, ly, lw, lh] of linePositions) {
        if (lx + lw > maxX) maxX = lx + lw
        if (lx < left) left = lx
        if (ly < top) top = ly
        if (ly + lh > maxY) maxY = ly + lh
      }
      // maxX should never be past right edge of window frame
      // this fixes logical issues in line finding from swift for now
      if (Desktop.state.appState) {
        const { offset, bounds } = Desktop.state.appState
        maxX = Math.min(
          offset[0] + bounds[0] - PAD * 2 /* reverse linepad */,
          maxX,
        )
      }
      return { left, top, width: maxX - left, height: maxY - top }
    }

    watchMouseForPeekFocus = () => {
      // if mouse within bounds + not hidden, focus peek
      this.react(
        () => [
          Desktop.state.mousePosition,
          App.state.peekHidden,
          Desktop.isHoldingOption,
        ],
        ([{ x, y }, isHidden]) => {
          if (isHidden || !this.peek) {
            this.focused = false
            return
          }
          const { position, size } = this.peek
          const withinX = x > position[0] && x < position[0] + size[0]
          const withinY = y > position[1] && y < position[1] + size[1]
          this.focused = withinX && withinY
        },
      )
      // second reaction so it only triggers if value changes
      this.react(
        () => this.focused,
        focused => {
          Electron.setState({ peekFocused: focused })
          if (focused) {
            this.peekRef && this.peekRef.focus()
          } else {
            Swift.defocus()
          }
        },
      )
    }
  },
})
@view.electron
export default class PeekWindow extends React.Component<{}, PeekWindowState> {
  // ui related state/functionality
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
    this.positionPeekBasedOnWindow()
    this.watch(function watchPeekClose() {
      const key = App.state.peekClose
      if (!key) return
      const windows = this.state.windows.filter(p => `${p.key}` !== `${key}`)
      this.setState({ windows })
    })
  }

  componentWillUpdate(nextProps, nextState) {
    if (!isEqual(nextState, this.state)) {
      Electron.setState({ peekState: nextState })
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
        appTarget(Desktop.state.appState || {}),
        this.props.store.linesBoundingBox,
      ],
      ([appBB, linesBB]) => {
        // prefer using lines bounding box, fall back to app
        const box = linesBB || appBB
        if (!box) return
        const newProps = peekPosition(box)
        if (linesBB) {
          // add padding
          newProps.position[0] += newProps.arrowTowards === 'left' ? PAD : -PAD
        } else {
          // remove padding
          newProps.position[0] += newProps.arrowTowards === 'right' ? PAD : -PAD
        }
        const [peek, ...rest] = this.state.windows
        const newPeek = {
          ...peek,
          ...newProps,
        }
        if (!isEqual(newPeek, peek)) {
          this.setState({ windows: [newPeek, ...rest] })
        }
      },
    )
  }

  peekSend = () => console.log('peekSend, not started yet')

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

  render({ store }) {
    if (App.state.disablePeek) {
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
                isAttached
                  ? Electron.state.showDevTools.peek
                  : peek.showDevTools
              }
              alwaysOnTop={isAttached || peek.alwaysOnTop}
              animatePosition={this.state.wasShowing}
              show={peek.show}
              file={`${Constants.APP_URL}/peek?key=${peek.key}`}
              ref={isAttached ? store.handlePeekRef(peek) : idFn}
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
