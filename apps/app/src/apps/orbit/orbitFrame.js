import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import * as Constants from '~/constants'
import { ORBIT_WIDTH } from '@mcro/constants'
import OrbitArrow from './orbitArrow'
import OrbitIndicator from './orbitIndicator'

const animationDuration = App.animationDuration
const SHADOW_PAD = 85
const ARROW_PAD = 15
const DOCKED_SHADOW = [0, 0, SHADOW_PAD, [0, 0, 0, 0.2]]
const iWidth = 4

class OrbitFrameStore {
  orbitFrame = null

  @react
  wasShowingOrbit = [
    () => App.isShowingOrbit,
    async (val, { sleep, setValue }) => {
      if (!val) {
        await sleep(animationDuration)
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

  render({ store, children, theme, headerBg }) {
    const { fullScreen, orbitDocked, position, size } = Electron.orbitState
    const { orbitOnLeft } = Electron
    const borderColor = theme.base.background.darken(0.25).desaturate(0.6)
    const borderShadow = ['inset', 0, 0, 0, 0.5, borderColor]
    const background = theme.base.background
    const borderLeftRadius =
      !orbitOnLeft || orbitDocked ? 0 : Constants.BORDER_RADIUS
    const borderRightRadius =
      fullScreen || orbitDocked ? 0 : orbitOnLeft ? 0 : Constants.BORDER_RADIUS
    const orbitLightShadow = [
      [orbitOnLeft ? -15 : 15, 4, 35, 0, [0, 0, 0, 0.05]],
    ]
    const animationStyles = App.isShowingOrbit
      ? {
          opacity: 1,
          transform: {
            x: 0,
          },
        }
      : {
          opacity: 0,
          transform: {
            x: orbitOnLeft
              ? ORBIT_WIDTH * 0.15 - ARROW_PAD - (ARROW_PAD + iWidth) + 4
              : -(ORBIT_WIDTH * 0.15),
          },
        }
    return (
      <orbitFrame
        css={{
          width: size[0],
          // TODO HACKINESS fix the size/y calc in orbitPosition.js
          height: size[1] - (orbitDocked ? 0 : 15),
          transform: {
            x: position[0],
            y: position[1] + (orbitDocked ? 0 : 5),
          },
        }}
      >
        <OrbitArrow
          if={App.isAttachedToWindow && !orbitDocked}
          arrowSize={22}
          orbitOnLeft={orbitOnLeft}
          background={headerBg}
          borderColor={borderColor}
        />
        <OrbitIndicator
          store={store}
          iWidth={iWidth}
          orbitOnLeft={orbitOnLeft}
        />
        {/* <orbitInnerShadow /> */}
        <overflowWrap
          $orbitAnimate={store.shouldAnimate}
          $pointerEvents={App.isShowingOrbit && !App.isAnimatingOrbit}
          css={{
            overflow: orbitDocked ? 'visible' : 'hidden',
            padding: orbitDocked ? 0 : SHADOW_PAD,
            margin: orbitDocked ? 0 : -SHADOW_PAD,
            ...(orbitDocked
              ? { right: 0 }
              : {
                  right: orbitOnLeft ? ARROW_PAD : 'auto',
                  left: !orbitOnLeft ? ARROW_PAD : 'auto',
                  paddingRight: orbitOnLeft ? 0 : SHADOW_PAD,
                  marginRight: orbitOnLeft ? 0 : -SHADOW_PAD,
                  paddingLeft: !orbitOnLeft ? 0 : SHADOW_PAD,
                  marginLeft: !orbitOnLeft ? 0 : -SHADOW_PAD,
                }),
          }}
        >
          <orbit
            css={{
              borderLeftRadius,
              borderRightRadius,
              ...animationStyles,
            }}
            $orbitAnimate={store.shouldAnimate}
          >
            <orbitBorder
              css={{
                borderLeftRadius: borderLeftRadius ? borderLeftRadius - 1 : 0,
                borderRightRadius: borderRightRadius
                  ? borderRightRadius - 1
                  : 0,
                boxShadow: [
                  borderShadow,
                  orbitDocked ? [DOCKED_SHADOW] : [orbitLightShadow],
                ].filter(Boolean),
              }}
            />
            <content
              css={{
                background,
                // makes the shadow go offscreen nicely
                marginRight: 0,
                paddingRight: 0,
                borderLeftRadius,
                borderRightRadius,
              }}
            >
              {children}
              <expand>
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
      position: 'absolute',
      zIndex: 1,
    },
    orbitBorder: {
      pointerEvents: 'none',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10000000,
    },
    orbitInnerShadow: {
      position: 'absolute',
      top: 20,
      bottom: 20,
      left: ARROW_PAD,
      right: ARROW_PAD,
      boxShadow: [[0, 0, 90, 0, [0, 0, 0, 0.075]]],
      zIndex: -1,
    },
    orbit: {
      width: ORBIT_WIDTH,
      position: 'relative',
      transition: 'none',
      flex: 1,
    },
    orbitAnimate: {
      willChange: 'transform, opacity',
      transition: `
        transform ease-in ${animationDuration}ms,
        opacity ease-in ${animationDuration / 2}ms ${animationDuration / 2}ms
      `,
    },
    // used to hide edge overlap of drawer during in animation
    overflowWrap: {
      // overflow: 'hidden',
      alignSelf: 'flex-end',
      flex: 1,
      position: 'relative',
      pointerEvents: 'none !important',
    },
    pointerEvents: {
      pointerEvents: 'all !important',
    },
    hideOverflow: {
      overflow: 'hidden',
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
