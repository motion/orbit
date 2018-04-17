import * as React from 'react'
import * as Constants from '~/constants'
import { view, react } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { memoize } from 'lodash'
import * as Helpers from '~/helpers'
import { App, Electron } from '@mcro/all'
import * as Mobx from 'mobx'

// type PeekTarget = {
//   key: string,
//   top: number,
//   left: number,
//   width: number,
//   height: number,
// }

const idFn = _ => _
const PAD = 15
const peekW = 520
const peekH = 700
const EDGE_PAD = 20
const TOP_OFFSET = -20
const log = debug('PeekWindow')
const windowProps = {
  frame: false,
  hasShadow: false,
  background: '#00000000',
  webPreferences: Constants.WEB_PREFERENCES,
  transparent: true,
}

const peekPosition = target => {
  const { orbitOnLeft } = Electron
  const [width] = Electron.orbitState.size
  const { left, top } = target
  const [screenW, screenH] = Helpers.getScreenSize()
  const leftSpace = left
  const rightSpace = screenW - (left + width)

  // prefer bigger area
  let peekOnLeft = leftSpace > rightSpace
  let pW = peekW
  let pH = peekH
  let x
  let y = top + TOP_OFFSET

  // prefer more strongly away from app if possible
  if (peekOnLeft && !orbitOnLeft && rightSpace > pW - PAD * 2) {
    peekOnLeft = false
  }
  if (!peekOnLeft && orbitOnLeft && leftSpace > pW - PAD * 2) {
    peekOnLeft = true
  }
  if (peekOnLeft) {
    x = left - pW
    if (pW > leftSpace) {
      pW = leftSpace
      x = 0
    }
    if (orbitOnLeft) {
      x += PAD
    } else {
      x += PAD
    }
  } else {
    x = left + width
    if (orbitOnLeft) {
      x -= PAD
    } else {
      x -= PAD
    }
    if (pW > rightSpace) {
      pW = rightSpace
    }
  }
  if (pH + y + EDGE_PAD > screenH) {
    log(`too tall`)
    y = screenH - EDGE_PAD - peekH
  }
  return {
    position: [Math.round(x), Math.round(y)],
    size: [pW, pH],
    peekOnLeft,
  }
}

class PeekStore {
  @react
  positionPeekBasedOnTarget = [
    () => App.state.peekTarget,
    peekTarget => {
      if (!peekTarget) return
      if (Electron.orbitState.fullScreen) {
        return
      }
      // focus peek new target to move above orbit
      // if (this.props.electronStore.peekRef) {
      //   this.props.electronStore.peekRef.focus()
      // }
      Electron.updatePeek(Electron.currentPeek, peek => {
        console.log(
          'set position',
          peekTarget.position,
          peekPosition(peekTarget.position),
        )
        Object.assign(peek, peekPosition(peekTarget.position))
      })
    },
  ]
}

@view.attach('electronStore')
@view.provide({
  store: PeekStore,
})
@view.electron
export default class PeekWindow {
  // ui related state/functionality
  peekKey = 0
  mounted = false

  componentWillMount() {
    Electron.setPeekState({
      windows: [
        {
          key: this.peekKey,

          size: [peekW, peekH],
          position: [0, 0],
          show: false,
        },
      ],
    })
  }

  componentDidMount() {
    this.mounted = true
  }

  handleReadyToShow = memoize(peek => () => {
    if (!peek.show) {
      Electron.updatePeek(peek, peek => {
        peek.show = true
      })
    }
  })

  handlePeekMove = memoize(peek => newPosition => {
    if (!this.mounted) {
      return
    }
    // Electron.updatePeek(peek, peek => {
    //   if (!this.isAnimatingPeek && !peek.isTorn) {
    //     this.isAnimatingPeek = true // bug test fix
    //     peek.position = newPosition
    //     this.tearPeek()
    //   } else {
    //     peek.position = newPosition
    //   }
    // })
  })

  tearPeek = () => {
    console.log('tearPeek')
    // const [peek, ...otherPeeks] = Electron.peekState.windows
    // this.peekKey++
    // const windows = [
    //   // new hidden peek window
    //   {
    //     ...peek,
    //     key: this.peekKey,
    //     show: false,
    //   },
    //   // current peek
    //   {
    //     ...peek,
    //     show: true,
    //   },
    //   // keep the rest
    //   ...otherPeeks,
    // ]
    // Electron.setPeekState({ windows })
  }

  render({ electronStore }) {
    const peekWindows = Mobx.toJS(Electron.peekState.windows)
    electronStore.show
    return (
      <React.Fragment>
        {peekWindows.map((peek, index) => {
          // peek always in front
          const isAttached = index === 0
          const show = electronStore.show >= 1 ? peek.show : false
          const opacity = electronStore.show <= 1 ? 0 : 1
          return (
            <Window
              key={peek.key}
              showDevTools={
                isAttached
                  ? Electron.state.showDevTools.peek
                  : peek.showDevTools
              }
              alwaysOnTop={isAttached || peek.alwaysOnTop}
              animatePosition={App.isShowingPeek && App.wasShowingPeek}
              show={show}
              opacity={opacity}
              file={`${Constants.APP_URL}/peek?key=${peek.key}`}
              ref={isAttached ? electronStore.handlePeekRef(peek) : idFn}
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
