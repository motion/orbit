import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import * as Constants from '~/constants'
import { ORBIT_WIDTH } from '@mcro/constants'
import OrbitArrow from './orbitArrow'
import OrbitIndicator from './orbitIndicator'

const { SHADOW_PAD } = Constants
const DOCKED_SHADOW = [0, 0, 85, [0, 0, 0, 0.16]]
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
    const orbitLightShadow = [
      [orbitOnLeft ? -15 : 15, 4, 35, 0, [0, 0, 0, 0.05]],
    ]
    const animationStyles = App.isShowingOrbit
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
              ? ORBIT_WIDTH * 0.15 - SHADOW_PAD - (SHADOW_PAD + iWidth) + 4
              : -(ORBIT_WIDTH * 0.15),
          },
        }
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
          $orbitAnimate={store.shouldAnimate}
          css={{
            boxShadow: [
              borderShadow,
              fullScreen || orbitDocked ? [DOCKED_SHADOW] : [orbitLightShadow],
            ].filter(Boolean),
            // background: 'red',
            top: orbitDocked ? 0 : SHADOW_PAD,
            bottom: orbitDocked ? 0 : SHADOW_PAD,
            left: orbitOnLeft ? 0 : SHADOW_PAD * 3,
            right: !orbitOnLeft ? -SHADOW_PAD * 2 : SHADOW_PAD,
            borderLeftRadius: borderLeftRadius ? borderLeftRadius - 1 : 0,
            borderRightRadius: borderRightRadius ? borderRightRadius - 1 : 0,
            ...animationStyles,
          }}
        />
        <overflowWrap
          $orbitAnimate={store.shouldAnimate}
          $pointerEvents={App.isShowingOrbit && !App.isAnimatingOrbit}
          css={{
            padding: orbitDocked ? 0 : [SHADOW_PAD, 0],
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
              paddingRight: !orbitOnLeft || orbitDocked ? 0 : SHADOW_PAD,
              ...animationStyles,
            }}
            $orbitAnimate={store.shouldAnimate}
            $orbitHeight={fullScreen ? 0 : orbitPage.adjustHeight}
            $orbitFullScreen={fullScreen}
          >
            {/* <bg
              css={{
                background: `linear-gradient(45deg, #EC98B1, #F5F1B1)`,
                opacity: 0.5,
              }}
            />
            <bg
              css={{
                background: `radial-gradient(#EC98B1, #F5F1B1)`,
                opacity: 0.5,
              }}
            />
            <bg
              css={{
                background: `linear-gradient(-45deg, #EC98B1, #F5F1B1)`,
              }}
            /> */}
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
    bg: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
    },
    orbitFrame: {
      flex: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
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
