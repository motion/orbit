import * as React from 'react'
import { view, react, isEqual } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron, Desktop } from '@mcro/all'
import * as Constants from '~/constants'

const SHADOW_PAD = 15
const BORDER_RADIUS = 11
const background = 'rgba(0,0,0,0.89)'
const orbitShadow = [[0, 3, SHADOW_PAD, [0, 0, 0, 0.2]]]
const orbitLightShadow = [[0, 3, SHADOW_PAD, [0, 0, 0, 0.1]]]
const iWidth = 4
// const log = debug('OrbitFrame')

const Indicator = view(({ iWidth, orbitOnLeft }) => {
  if (Date.now() - Desktop.state.lastAppChange < 100) {
    return null
  }
  // log('on', orbitOnLeft)
  return (
    <indicator
      css={{
        position: 'absolute',
        background: Constants.ORBIT_COLOR,
        boxShadow: [
          // [-5, 0, orbitOnLeft ? 10 : -10, 5, [255, 255, 255, 0.5]],
          [-2, 0, 10, 0, [0, 0, 0, 0.15]],
        ],
        width: iWidth,
        height: 20,
        top: 8,
        opacity: App.isShowingOrbit ? 0 : 1,
        right: orbitOnLeft ? SHADOW_PAD : 'auto',
        left: !orbitOnLeft ? SHADOW_PAD : 'auto',
        borderLeftRadius: orbitOnLeft ? 20 : 0,
        borderRightRadius: !orbitOnLeft ? 20 : 0,
        // opacity: App.isShowingOrbit ? 0 : 1,
        transition: `opacity ease-in 70ms ${App.animationDuration}`,
      }}
    />
  )
})

const OrbitArrow = view(({ orbitOnLeft, arrowSize, css }) => {
  let arrowStyle
  if (orbitOnLeft) {
    arrowStyle = {
      top: 53,
      right: SHADOW_PAD - arrowSize,
    }
  } else {
    arrowStyle = {
      top: 53,
      left: 3,
    }
  }
  const ms = App.animationDuration
  return (
    <UI.Arrow
      size={arrowSize}
      towards={Electron.orbitArrowTowards}
      background={background}
      css={{
        position: 'absolute',
        ...arrowStyle,
        zIndex: 100,
        transition: App.isShowingOrbit
          ? `
            opacity ease-out ${ms * 0.5},
            transform ease-out ${ms * 0.8}ms
          `
          : `all ease-in ${ms * 0.5}ms ${ms * 0.6}ms`,
        opacity: App.isShowingOrbit ? 1 : 0,
        transform: {
          x: App.isShowingOrbit
            ? 0
            : (orbitOnLeft ? -arrowSize : arrowSize) / 3,
        },
        ...css,
      }}
    />
  )
})

@view({
  store: class OrbitFrameStore {
    orbitFrame = null

    @react
    wasShowingOrbit = [
      () => App.isShowingOrbit,
      async (val, { sleep, setValue }) => {
        if (!val) {
          // ew, but can be lax
          await sleep(App.animationDuration * 1.5)
          setValue(false)
        } else {
          setValue(val)
        }
      },
    ]

    get shouldAnimate() {
      return App.isShowingOrbit || this.wasShowingOrbit
    }

    get isDragging() {
      return (
        Desktop.state.mouseDown &&
        Desktop.state.lastAppChange > Desktop.state.mouseDown.at
      )
    }

    hasRepositioned = true

    @react
    isRepositioning = [
      () => [Desktop.state.lastAppChange, Electron.state.willFullScreen],
      async ([app, fs], { when, sleep, setValue }) => {
        const isFullScreen = fs > app
        setValue(true)
        if (isFullScreen) {
          await sleep(100)
        } else {
          await sleep(100)
          setValue('READY')
          await when(() => this.hasRepositioned)
          await sleep(100)
          // log('SHOW')
        }
        setValue(false)
      },
    ]
  },
})
export default class OrbitFrame {
  componentDidMount() {
    this.props.store.orbitFrame = this
  }

  componentDidUpdate() {
    if (this.props.store.isRepositioning === 'READY') {
      this.props.store.hasRepositioned = true
    }
  }

  render({ store, orbitPage, children }) {
    const { fullScreen } = Electron.orbitState
    const { orbitOnLeft } = Electron
    const arrowSize = 22
    const boxShadow = fullScreen ? orbitShadow : orbitLightShadow
    const hide =
      !App.isShowingOrbit && (store.isRepositioning || store.isDragging)
    log(`${orbitOnLeft} repo ${store.isRepositioning}`)
    return (
      <UI.Theme name="dark">
        <orbitFrame css={{ flex: 1, opacity: hide ? 0 : 1 }}>
          <OrbitArrow
            if={App.isAttachedToWindow}
            arrowSize={arrowSize}
            orbitOnLeft={orbitOnLeft}
          />
          <Indicator
            if={!fullScreen}
            store={store}
            iWidth={iWidth}
            orbitOnLeft={orbitOnLeft}
          />
          <overflowWrap
            $orbitAnimate={store.shouldAnimate}
            $pointerEvents={App.isShowingOrbit}
            $hideOverflow
            css={{
              ...(fullScreen
                ? { right: 0 }
                : {
                    right: orbitOnLeft ? 15 : 'auto',
                    left: !orbitOnLeft ? 15 : 'auto',
                  }),
            }}
          >
            <orbit
              css={{
                paddingRight: fullScreen ? 0 : SHADOW_PAD,
              }}
              $orbitAnimate={store.shouldAnimate}
              $orbitHeight={orbitPage.adjustHeight}
              $orbitStyle={[App.isShowingOrbit, orbitOnLeft, iWidth]}
              $orbitFullScreen={fullScreen}
            >
              <content
                css={{
                  boxShadow: App.isShowingOrbit ? boxShadow : 'none',
                  borderLeftRadius: orbitOnLeft ? BORDER_RADIUS : 5,
                  borderRightRadius:
                    fullScreen || orbitOnLeft ? 5 : BORDER_RADIUS,
                }}
              >
                {children}
              </content>
            </orbit>
          </overflowWrap>
        </orbitFrame>
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
      // opacity: 0,
    },
    orbitAnimate: {
      transition: `
        transform ease-in ${App.animationDuration}ms,
        opacity ease-in ${App.animationDuration / 2}ms ${App.animationDuration /
        2}ms
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
    orbitStyle: ([isShowing, orbitOnLeft, iWidth]) => {
      console.log('orbitStyle', [isShowing, orbitOnLeft, iWidth])
      return isShowing
        ? {
            opacity: 1,
            transform: {
              x: orbitOnLeft ? 0 : -SHADOW_PAD * 2,
            },
          }
        : {
            // marginRight: orbitOnLeft ? SHADOW_PAD : -SHADOW_PAD,
            opacity: 0,
            transform: {
              x: orbitOnLeft
                ? 330 - SHADOW_PAD - (SHADOW_PAD + iWidth) + 4
                : -330,
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
