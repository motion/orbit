import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import * as Constants from '~/constants'
import { ORBIT_WIDTH } from '@mcro/constants'
import OrbitArrow from './orbitArrow'
import OrbitIndicator from './orbitIndicator'

const { SHADOW_PAD } = Constants
const APP_SHADOW = [0, 0, 60, [0, 0, 0, 0.25]]
const iWidth = 4
const arrowSize = 22
// const log = debug('OrbitFrame')

class OrbitFrameStore {
  orbitFrame = null

  @react
  wasShowingOrbit = [
    () => App.isShowingOrbit,
    async (val, { sleep, setValue }) => {
      if (!val) {
        await sleep(App.animationDuration)
        setValue(false)
      } else {
        setValue(val)
      }
    },
  ]

  get shouldAnimate() {
    return App.isShowingOrbit || this.wasShowingOrbit
  }
}

@UI.injectTheme
@view({
  store: OrbitFrameStore,
})
export default class OrbitFrame {
  componentDidMount() {
    this.props.store.orbitFrame = this
  }

  render({ store, orbitPage, children, theme, headerBg }) {
    const { fullScreen, orbitDocked, position, size } = Electron.orbitState
    const { orbitOnLeft } = Electron
    const borderColor = theme.base.background.darken(0.25).desaturate(0.6)
    const borderShadow = ['inset', 0, 0, 0, 0.5, borderColor]
    const background = theme.base.background
    const borderLeftRadius =
      !orbitOnLeft || orbitDocked ? 0 : Constants.BORDER_RADIUS
    const borderRightRadius =
      fullScreen || orbitDocked ? 0 : orbitOnLeft ? 0 : Constants.BORDER_RADIUS
    const orbitLightShadow = [[0, 2, 30, 0, [0, 0, 0, 0.08]]]
    return (
      <orbitFrame
        css={{
          width: orbitDocked ? 'auto' : size[0],
          height: size[1],
          transform: {
            x: position[0],
            y: position[1],
          },
        }}
      >
        <OrbitArrow
          if={App.isAttachedToWindow && !orbitDocked}
          arrowSize={arrowSize}
          orbitOnLeft={orbitOnLeft}
          background={headerBg}
          borderColor={borderColor}
        />
        <OrbitIndicator
          if={!fullScreen}
          store={store}
          iWidth={iWidth}
          orbitOnLeft={orbitOnLeft}
        />
        <orbitBorder
          $orbitAnimate={App.isShowingOrbit}
          css={{
            boxShadow: [
              borderShadow,
              fullScreen || orbitDocked ? [APP_SHADOW] : [orbitLightShadow],
            ].filter(Boolean),
            top: orbitDocked ? 0 : SHADOW_PAD,
            bottom: orbitDocked ? 0 : SHADOW_PAD,
            left: !orbitDocked && orbitOnLeft ? 0 : SHADOW_PAD,
            right: !orbitOnLeft ? 0 : SHADOW_PAD,
            borderLeftRadius: borderLeftRadius ? borderLeftRadius - 1 : 0,
            borderRightRadius: borderRightRadius ? borderRightRadius - 1 : 0,
            opacity: App.isShowingOrbit ? 1 : 0,
          }}
        />
        <overflowWrap
          $orbitAnimate={store.shouldAnimate}
          $pointerEvents={App.isShowingOrbit && !App.isAnimatingOrbit}
          css={{
            padding: orbitDocked ? [0, 0, 0, SHADOW_PAD] : [SHADOW_PAD, 0],
            ...(fullScreen || orbitDocked
              ? { right: 0 }
              : {
                  right: orbitOnLeft ? 15 : 'auto',
                  left: !orbitOnLeft ? 15 : 'auto',
                }),
          }}
        >
          <orbit
            css={{
              borderLeftRadius,
              borderRightRadius,
              marginLeft: fullScreen || orbitDocked ? 0 : SHADOW_PAD,
              paddingLeft: orbitOnLeft ? 0 : SHADOW_PAD,
              paddingRight: !orbitOnLeft ? 0 : SHADOW_PAD,
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
                        ? ORBIT_WIDTH * 0.15 -
                          SHADOW_PAD -
                          (SHADOW_PAD + iWidth) +
                          4
                        : -(ORBIT_WIDTH * 0.15),
                    },
                  }),
            }}
            $orbitAnimate={store.shouldAnimate}
            $orbitHeight={fullScreen ? 0 : orbitPage.adjustHeight}
            $orbitFullScreen={fullScreen}
          >
            <content
              css={{
                background,
                // makes the shadow go offscreen nicely
                marginRight: fullScreen ? -SHADOW_PAD : 0,
                paddingRight: fullScreen ? SHADOW_PAD : 0,
                borderLeftRadius,
                borderRightRadius,
              }}
            >
              {children}
              <expand if={!fullScreen}>
                <fade
                  css={{
                    opacity: 1,
                    background: `linear-gradient(transparent, ${
                      theme.base.background
                    } 95%)`,
                  }}
                />
              </expand>
            </content>
          </orbit>
        </overflowWrap>
      </orbitFrame>
    )
  }

  static style = {
    orbitFrame: {
      flex: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    orbit: {
      width: ORBIT_WIDTH,
      position: 'relative',
      transition: 'none',
    },
    orbitAnimate: {
      willChange: 'transform, opacity',
      transition: `
        transform ease-in ${App.animationDuration}ms,
        opacity ease-in ${App.animationDuration / 2}ms ${App.animationDuration /
        2}ms
      `,
    },
    orbitBorder: {
      position: 'absolute',
      zIndex: 1000000,
    },
    // used to hide edge overlap of drawer during in animation
    overflowWrap: {
      overflow: 'hidden',
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
      top: '85%',
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
