// @flow
import * as React from 'react'
import * as Constants from '~/constants'
import { view } from '@mcro/black'
import { Window } from '@mcro/reactron'
import * as Helpers from '~/helpers'
import { App, Desktop, Electron, Swift } from '@mcro/all'

const PAD = 15
const INITIAL_SIZE = [330, 420]
const log = debug('OrbitWindow')

const orbitPosition = ({ left, top, width, height }) => {
  const EDGE_PAD = 20
  let [orbitW] = INITIAL_SIZE
  const [screenW, screenH] = Helpers.getScreenSize()
  const leftSpace = left
  const rightSpace = screenW - (left + width)
  const orbitOnLeft = leftSpace > rightSpace
  let x
  let y = top
  if (orbitOnLeft) {
    x = left - orbitW
    if (orbitW > leftSpace) {
      orbitW = leftSpace
      x = 0
    }
  } else {
    x = left + width
    if (orbitW > rightSpace) {
      orbitW = rightSpace
    }
  }
  if (height + y + EDGE_PAD > screenH) {
    // height = screenH - EDGE_PAD - y
    log(`too big, adjusting height ${height} screenH ${screenH}`)
  }
  return {
    position: [Math.round(x), Math.round(y)],
    size: [orbitW, height],
    arrowTowards: orbitOnLeft ? 'right' : 'left',
  }
}

@view.provide({
  store: class OrbitStore {
    orbitRef = null

    willMount() {
      this.watchMouseForOrbitFocus()
    }

    handleOrbitRef = ref => {
      if (!ref) return
      if (this.orbitRef) return
      this.orbitRefs = ref.window
      this.orbitRefs.focus() // puts it above highlights
    }

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

    watchMouseForOrbitFocus = () => {
      // if mouse within bounds + not hidden, focus orbit
      this.react(
        () => [Desktop.state.mousePosition, App.state.orbitHidden],
        ([{ x, y }, isHidden]) => {
          if (isHidden) {
            Electron.setState({ orbitFocused: false })
            return
          }
          if (!this.orbitRef) return
          const { position, size } = this.orbit
          const withinX = x > position[0] && x < position[0] + size[0]
          const withinY = y > position[1] && y < position[1] + size[1]
          const focused = withinX && withinY
          Electron.setState({
            orbitState: { ...Electron.orbitState, focused },
          })
        },
      )
      // separate react to only call actions if value changes
      this.react(
        () => Electron.orbitState.focused,
        focused => {
          if (focused) {
            this.orbitRef && this.orbitRef.focus()
          } else {
            Swift.defocus()
          }
        },
      )
    }
  },
})
@view.electron
export default class OrbitWindow extends React.Component {
  mounted = false
  state = {
    size: INITIAL_SIZE,
    position: [0, 0],
  }

  componentDidMount() {
    this.mounted = true
    this.positionOrbitBasedOnWindow()
  }

  positionOrbitBasedOnWindow = () => {
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
        const newProps = orbitPosition(box)
        if (linesBB) {
          // add padding
          newProps.position[0] += newProps.arrowTowards === 'left' ? PAD : -PAD
        } else {
          // remove padding
          newProps.position[0] += newProps.arrowTowards === 'right' ? PAD : -PAD
        }
        Electron.setState({
          orbitState: {
            ...Electron.state.orbit,
            ...newProps,
          },
        })
      },
    )
  }

  handleReadyToShow = () => {
    if (!Electron.orbitState.show) {
      this.setState({ show: true })
    }
  }

  handleOrbitMove = position => {
    if (!this.mounted) {
      return
    }
    this.setState({ position })
  }

  render({ store }) {
    return (
      <Window
        frame={false}
        hasShadow={false}
        background="#00000000"
        webPreferences={Constants.WEB_PREFERENCES}
        transparent={true}
        showDevTools={Electron.state.showDevTools.orbit}
        alwaysOnTop
        animatePosition={Electron.orbitState.wasShowing}
        show={Electron.orbitState.show}
        size={Electron.orbitState.size}
        position={Electron.orbitState.position}
        file={`${Constants.APP_URL}/orbit`}
        ref={store.handleOrbitRef}
        onReadyToShow={this.handleReadyToShow}
        onMove={this.handleOrbitMove}
      />
    )
  }
}
