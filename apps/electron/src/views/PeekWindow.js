// @flow
import * as React from 'react'
import * as Constants from '~/constants'
import { view } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { memoize } from 'lodash'
import * as Helpers from '~/helpers'
import { App, Desktop, Electron } from '@mcro/all'
import * as Mobx from 'mobx'

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

const updatePeek = (peek, cb) => {
  const windows = [...Electron.peekState.windows]
  const nextPeek = windows.find(x => x.key === peek.key)
  cb(nextPeek)
  log(`updatePeek: before`, peek, nextPeek)
  Electron.setPeekState({ windows })
}

const idFn = _ => _
const PAD = 15
const INITIAL_SIZE = [330, 420]
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

@view.provide({
  store: class PeekStore {
    peekRefs = {}
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

    watchMouseForPeekFocus = () => {
      // if mouse within bounds + not hidden, focus peek
      this.react(
        () => [Desktop.state.mousePosition, App.state.peekHidden],
        ([{ x, y }, isHidden]) => {
          if (isHidden) {
            Electron.setPeekState({ focused: false })
            return
          }
          if (!this.peek) return
          const { position, size } = this.peek
          const withinX = x > position[0] && x < position[0] + size[0]
          const withinY = y > position[1] && y < position[1] + size[1]
          const focused = withinX && withinY
          Electron.setPeekState({ focused })
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

  componentWillMount() {
    Electron.setPeekState({
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
    })
  }

  componentDidMount() {
    this.mounted = true
    this.positionPeekBasedOnTarget()
    this.watch(function watchPeekClose() {
      const key = App.state.peekClose
      if (!key) return
      const windows = Electron.peekState.windows.filter(
        p => `${p.key}` !== `${key}`,
      )
      Electron.setPeekState({ windows })
    })
  }

  positionPeekBasedOnTarget = () => {
    this.react(
      () => App.state.peekTarget,
      peekTarget => {
        if (!peekTarget) return
        updatePeek(Electron.currentPeek, peek => {
          let { position, size, arrowTowards } = peekPosition(
            peekTarget.position,
          )
          position[0] += arrowTowards === 'right' ? PAD : -PAD
          peek.position = position
          peek.size = size
          peek.arrowToward = arrowTowards
        })
      },
    )
  }

  peekSend = () => console.log('peekSend, not started yet')

  handleReadyToShow = memoize(peek => () => {
    if (!peek.show) {
      updatePeek(peek, peek => {
        peek.show = true
      })
    }
  })

  handlePeekMove = memoize(peek => newPosition => {
    if (!this.mounted) {
      return
    }
    log(`handlePeekMove`, newPosition)
    // updatePeek(peek, peek => {
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

  render({ store }) {
    const windowProps = {
      frame: false,
      hasShadow: false,
      background: '#00000000',
      webPreferences: Constants.WEB_PREFERENCES,
      transparent: true,
    }
    return (
      <React.Fragment>
        {Mobx.toJS(Electron.peekState.windows).map((peek, index) => {
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
              animatePosition={Electron.peekState.wasShowing}
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
