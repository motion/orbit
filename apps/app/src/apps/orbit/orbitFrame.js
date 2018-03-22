import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron, Desktop } from '@mcro/all'
import * as Constants from '~/constants'

const SHADOW_PAD = 15
const BORDER_RADIUS = 11
const background = 'rgba(0,0,0,0.89)'
const orbitShadow = [[0, 3, SHADOW_PAD, [0, 0, 0, 0.2]]]
const orbitLightShadow = [[0, 3, SHADOW_PAD, [0, 0, 0, 0.1]]]
// const log = debug('OrbitFrame')

const Indicator = ({ iWidth, onLeft }) => {
  return (
    <indicator
      css={{
        position: 'absolute',
        background: Constants.ORBIT_COLOR,
        boxShadow: [
          // [-5, 0, onLeft ? 10 : -10, 5, [255, 255, 255, 0.5]],
          [-2, 0, 10, 0, [0, 0, 0, 0.15]],
        ],
        width: iWidth,
        height: 36,
        top: 31,
        left: onLeft ? SHADOW_PAD - iWidth : 'auto',
        right: !onLeft ? SHADOW_PAD - iWidth : 'auto',
        borderLeftRadius: onLeft ? 4 : 0,
        borderRightRadius: !onLeft ? 4 : 0,
        // opacity: App.isShowingOrbit ? 0 : 1,
        transition: 'all ease-in 100ms',
      }}
    />
  )
}

const OrbitArrow = ({ arrowSize, arrowTowards, arrowStyle }) => (
  <UI.Arrow
    size={arrowSize}
    towards={arrowTowards}
    background={background}
    css={{
      position: 'absolute',
      ...arrowStyle,
      zIndex: 100,
    }}
  />
)

@view({
  store: class OrbitFrameStore {
    orbitFrame = null

    @react
    fixPinnedBug = [
      () => Electron.orbitState.pinned,
      pinned => {
        if (pinned) return
        console.log('FIX PIN BUG')
        if (this.orbitFrame) {
          this.orbitFrame.setState({ x: Math.random() })
        }
      },
      { delay: App.animationDuration * 10 },
    ]

    @react
    wasShowingOrbit = [
      () => App.isShowingOrbit,
      async (val, { sleep, setValue }) => {
        if (!val) {
          // ew, but can be lax
          await sleep(App.animationDuration * 2)
          setValue(false)
        } else {
          setValue(val)
        }
      },
    ]

    get wasFullScreen() {
      const last = this._lastWFS || false
      this._lastWFS = Electron.orbitState.fullScreen
      return last
    }

    get shouldAnimate() {
      return App.isShowingOrbit || this.wasShowingOrbit
    }

    @react
    shouldHideWhileMoving = [
      () => Desktop.state.lastAppChange,
      async (_, { sleep, setValue }) => {
        if (Electron.isMouseInActiveArea && App.isShowingOrbit) {
          return
        }
        setValue(true)
        await sleep(300)
        setValue(false)
      },
    ]
  },
})
export default class OrbitFrame {
  state = {
    x: 0,
  }

  componentDidMount() {
    this.props.store.orbitFrame = this
  }

  render({ store, orbitPage, children, iWidth }) {
    const { fullScreen, arrowTowards } = Electron.orbitState
    const { onLeft } = Electron
    const arrowSize = 24
    let arrowStyle
    if (onLeft) {
      arrowStyle = {
        top: 53,
        right: SHADOW_PAD - arrowSize,
      }
    } else {
      arrowStyle = {
        top: 53,
        left: 1,
      }
    }
    const boxShadow = fullScreen ? orbitShadow : orbitLightShadow
    const hideOverflow =
      !fullScreen && (!App.isShowingOrbit || App.isAnimatingOrbit)
    log(`render`)
    return (
      <UI.Theme name="dark">
        <overflowWrap
          $orbitAnimate={store.shouldAnimate}
          $pointerEvents={App.isShowingOrbit}
          $hideOverflow={hideOverflow}
          $isHidden={store.shouldHideWhileMoving}
          css={{
            ...(fullScreen
              ? { right: 0 }
              : {
                  right: onLeft ? 15 : 'auto',
                  left: !onLeft ? 15 : 'auto',
                }),
          }}
        >
          <orbit
            css={{
              paddingRight: fullScreen ? 0 : SHADOW_PAD,
            }}
            $orbitAnimate={store.shouldAnimate}
            $orbitHeight={orbitPage.adjustHeight}
            $orbitStyle={[App.isShowingOrbit, onLeft, iWidth]}
            $orbitFullScreen={fullScreen}
          >
            <Indicator if={!fullScreen} iWidth={iWidth} onLeft={onLeft} />
            {/* first is arrow (above), second is arrow shadow (below) */}
            <OrbitArrow
              if={App.isAttachedToWindow}
              arrowSize={arrowSize}
              arrowTowards={arrowTowards}
              arrowStyle={arrowStyle}
            />
            <content
              css={{
                boxShadow: App.isShowingOrbit ? boxShadow : 'none',
                borderLeftRadius: onLeft ? BORDER_RADIUS : 0,
                borderRightRadius: fullScreen || onLeft ? 0 : BORDER_RADIUS,
              }}
            >
              {children}
            </content>
          </orbit>
        </overflowWrap>
      </UI.Theme>
    )
  }

  static style = {
    // used to hide edge overlap of drawer during in animation
    overflowWrap: {
      alignSelf: 'flex-end',
      width: '100%',
      height: '100%',
      position: 'relative',
      pointerEvents: 'none !important',
    },
    pointerEvents: {
      pointerEvents: 'all !important',
    },
    isHidden: {
      opacity: 0,
    },
    hideOverflow: {
      overflow: 'hidden',
    },
    unPad: {
      right: 0,
    },
    orbit: {
      right: -SHADOW_PAD,
      width: 330,
      padding: SHADOW_PAD,
      position: 'relative',
      willChange: 'transform, opacity',
      transition: 'none',
    },
    orbitAnimate: {
      transition: `
        transform ease-in ${App.animationDuration}ms,
        opacity ease-in ${App.animationDuration}ms
      `,
    },
    orbitHeight: adjust => {
      if (!adjust) {
        return {
          height: '100%',
        }
      }
      return {
        height: `calc(100% - ${adjust}px)`,
      }
    },
    orbitStyle: ([isShowing, onLeft, iWidth]) => {
      return isShowing
        ? {
            transform: {
              x: onLeft ? 0 : -SHADOW_PAD * 2,
              z: 0,
            },
          }
        : {
            // marginRight: onLeft ? SHADOW_PAD : -SHADOW_PAD,
            transform: {
              x: onLeft ? 330 - SHADOW_PAD - (SHADOW_PAD + iWidth) + 4 : -330,
              z: 0,
            },
          }
    },
    orbitFullScreen: {
      width: '100%',
      right: 0,
      transition: 'none',
    },
    orbitTorn: {
      pointerEvents: 'all !important',
      opacity: 1,
      transform: {
        y: 0,
      },
    },
    content: {
      flex: 1,
      // border: [1, 'transparent'],
      background,
      overflow: 'hidden',
      opacity: 1,
      position: 'relative',
    },
  }
}
