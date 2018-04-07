import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron, Desktop } from '@mcro/all'
import * as Constants from '~/constants'
import OrbitDivider from './orbitDivider'

const { SHADOW_PAD, APP_SHADOW } = Constants
const orbitLightShadow = [[0, 3, SHADOW_PAD, 0, [0, 0, 0, 0.1]]]
const iWidth = 4
const arrowSize = 22
// const log = debug('OrbitFrame')

const Indicator = view(({ iWidth, orbitOnLeft }) => {
  if (Date.now() - Desktop.state.lastAppChange < 100) {
    return null
  }
  if (Electron.orbitState.orbitDocked) {
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

@view
class OrbitArrow {
  render({ background, orbitOnLeft, arrowSize, css }) {
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
    let arrowTransformY
    if (App.state.hoveredWord) {
      const { top } = App.state.hoveredWord
      const orbitY = Electron.orbitState.position[1]
      const orbitH = Electron.orbitState.size[1]
      const arrowMinY = orbitY + 40
      const arrowMaxY = orbitY + orbitH - 40
      const offsetY = Math.min(arrowMaxY, Math.max(arrowMinY, top - orbitY))
      console.log(
        'adjust for hovered word',
        App.state.hoveredWord,
        top,
        orbitY,
        offsetY,
      )
      arrowTransformY = offsetY - arrowStyle.top
    }
    const ms = App.animationDuration
    return (
      <UI.Arrow
        size={arrowSize}
        towards={Electron.orbitArrowTowards}
        background={background}
        boxShadow={[['inset', 0, 0, 0, 0.5, background.darken(0.25)]]}
        // border={[1, '#000']}
        css={{
          position: 'absolute',
          ...arrowStyle,
          zIndex: 1000000000,
          transition: App.isShowingOrbit
            ? `
              opacity ease-out ${ms * 0.5},
              transform ease-out ${ms * 0.8}ms
            `
            : `
              opacity ease-in ${ms * 0.5}ms ${ms * 0.6}ms,
              transform ease-in 180ms
            `,
          opacity: App.isShowingOrbit ? 1 : 0,
          transform: {
            y: arrowTransformY || 0,
            x: App.isShowingOrbit
              ? orbitOnLeft ? -0.5 : 0.5
              : (orbitOnLeft ? -arrowSize : arrowSize) / 3,
          },
          ...css,
        }}
      />
    )
  }
}

class OrbitFrameStore {
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

  @react({ log: false })
  isRepositioning = [
    () => [Desktop.state.lastAppChange, Electron.state.willReposition],
    async ([app, fs], { when, sleep, setValue }) => {
      const willReposition = fs > app
      setValue(true)
      await sleep(App.animationDuration)
      setValue('READY')
      await when(() => this.hasRepositioned)
      if (willReposition) {
        return setValue(false)
      }
      await sleep(100)
      setValue(false)
    },
  ]
}

@UI.injectTheme
@view({
  store: OrbitFrameStore,
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

  render({ store, orbitPage, children, theme, headerBg }) {
    const { fullScreen, orbitDocked } = Electron.orbitState
    const { orbitOnLeft } = Electron
    const borderColor = theme.base.background.darken(0.2).desaturate(0.5)
    const borderShadow = ['inset', 0, 0, 0, 0.5, borderColor]
    const boxShadow = fullScreen ? [APP_SHADOW] : [orbitLightShadow]
    const background = theme.base.background
    const hide =
      !App.isShowingOrbit && (store.isRepositioning || store.isDragging)
    const borderLeftRadius =
      !orbitOnLeft || orbitDocked ? 0 : Constants.BORDER_RADIUS
    const borderRightRadius = fullScreen
      ? 0
      : orbitOnLeft ? 0 : Constants.BORDER_RADIUS
    return (
      <orbitFrame
        css={{
          flex: 1,
          opacity: hide ? 0 : 1,
        }}
      >
        <OrbitArrow
          if={App.isAttachedToWindow && !orbitDocked}
          arrowSize={arrowSize}
          orbitOnLeft={orbitOnLeft}
          background={headerBg}
        />
        <Indicator
          if={!fullScreen}
          store={store}
          iWidth={iWidth}
          orbitOnLeft={orbitOnLeft}
        />
        <orbitBorder
          css={{
            boxShadow: [borderShadow],
            borderLeftRadius,
            borderRightRadius,
          }}
        />
        <overflowWrap
          $orbitAnimate={store.shouldAnimate}
          $pointerEvents={App.isShowingOrbit && !App.isAnimatingOrbit}
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
              padding: orbitDocked ? 0 : SHADOW_PAD,
              paddingRight: fullScreen ? 0 : SHADOW_PAD,
              right: fullScreen ? 0 : -SHADOW_PAD,
              ...(App.isShowingOrbit
                ? {
                    opacity: 1,
                    transform: {
                      x: orbitOnLeft ? 0 : -SHADOW_PAD * 2,
                    },
                  }
                : {
                    opacity: 0,
                    transform: {
                      x: orbitOnLeft
                        ? 330 * 0.25 - SHADOW_PAD - (SHADOW_PAD + iWidth) + 4
                        : -(330 * 0.25),
                    },
                  }),
            }}
            $orbitAnimate={store.shouldAnimate}
            $orbitHeight={fullScreen ? 0 : orbitPage.adjustHeight}
            $orbitFullScreen={fullScreen}
          >
            <content
              css={{
                // borderRight: orbitOnLeft ? 'none' : border,
                background,
                boxShadow: App.isShowingOrbit ? boxShadow : 'none',
                // borderRight: orbitOnLeft ? [1, [0, 0, 0, 0.1]] : 0,
                borderLeftRadius,
                borderRightRadius,
              }}
            >
              {children}
              <expand if={!fullScreen}>
                <expandEnd
                  if={false}
                  css={{
                    opacity: 0.5,
                    background: `linear-gradient(transparent, ${
                      theme.base.background
                    })`,
                  }}
                />
                <fade
                  if={false}
                  css={{
                    opacity: 0.5,
                    background: `linear-gradient(transparent, ${
                      theme.base.background
                    } 80%)`,
                  }}
                />
                <OrbitDivider onMouseDown={orbitPage.barMouseDown} />
              </expand>
            </content>
          </orbit>
        </overflowWrap>
      </orbitFrame>
    )
  }

  static style = {
    orbitFrame: {
      // background: 'red',
      position: 'relative',
    },
    orbitBorder: {
      position: 'absolute',
      top: SHADOW_PAD,
      left: SHADOW_PAD,
      right: SHADOW_PAD,
      bottom: SHADOW_PAD,
      zIndex: 1000000,
    },
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
      width: 330,
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
        maxHeight: '100%',
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
      overflow: 'hidden',
      opacity: 1,
      position: 'relative',
    },
    fade: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
      pointerEvents: 'none',
    },
    expand: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      top: '80%',
      alignItems: 'flex-end',
      justifyContent: 'center',
      flexFlow: 'row',
      zIndex: 1000,
      overflow: 'hidden',
      pointerEvents: 'none',
    },
    expandEnd: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 50,
      alignItems: 'flex-end',
    },
  }
}
