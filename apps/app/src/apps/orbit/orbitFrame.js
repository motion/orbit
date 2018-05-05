import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App } from '@mcro/all'
import * as Constants from '~/constants'
import { ORBIT_WIDTH } from '@mcro/constants'
import OrbitArrow from './orbitArrow'
import OrbitIndicator from './orbitIndicator'

const SHADOW_PAD = 85
const ARROW_PAD = 15

class FrameStore {
  @react({
    log: false,
    defaultValue: { willAnimate: false, hidden: true },
  })
  animationState = [
    () => App.orbitState.hidden,
    async (hidden, { sleep, setValue }) => {
      // old value first to setup for transition
      setValue({ willAnimate: true, hidden: !hidden })
      await sleep(32)
      // new value, start transition
      setValue({ willAnimate: true, hidden })
      await sleep(App.animationDuration)
      // done animating, reset
      setValue({ willAnimate: false, hidden })
    },
  ]
}

const showingAnimation = {
  opacity: 1,
  transform: {
    x: 0,
  },
}

@UI.injectTheme
@view({
  store: FrameStore,
})
export default class OrbitFrame {
  render({ store, children, theme, headerBg }) {
    if (!store.animationState) {
      return null
    }
    const { hidden, willAnimate } = store.animationState
    const { position, size, orbitOnLeft } = App.orbitState
    const borderColor = theme.base.background.darken(0.25).desaturate(0.6)
    const borderShadow = ['inset', 0, 0, 0, 0.5, borderColor]
    const background = theme.base.background
    const borderLeftRadius = !orbitOnLeft ? 0 : Constants.BORDER_RADIUS
    const borderRightRadius = orbitOnLeft ? 0 : Constants.BORDER_RADIUS
    const orbitLightShadow = [
      [orbitOnLeft ? -15 : 15, 4, 35, 0, [0, 0, 0, 0.05]],
    ]
    const hiddenAnimation = {
      opacity: 0,
      transform: {
        x: orbitOnLeft ? 10 : -10,
      },
    }
    return (
      <orbitFrame
        css={{
          pointerEvents: hidden ? 'none' : 'auto',
          width: size[0],
          // TODO HACKINESS fix the size/y calc in orbitPosition.js
          height: size[1] - 15,
          transform: {
            x: position[0],
            y: position[1] + 5,
          },
        }}
      >
        <OrbitArrow
          arrowSize={22}
          hidden={hidden}
          willAnimate={willAnimate}
          orbitOnLeft={orbitOnLeft}
          background={headerBg}
          borderColor={borderColor}
        />
        <OrbitIndicator orbitOnLeft={orbitOnLeft} />
        <overflowWrap
          css={{
            overflow: 'hidden',
            padding: SHADOW_PAD,
            margin: -SHADOW_PAD,
            right: orbitOnLeft ? ARROW_PAD : 'auto',
            left: !orbitOnLeft ? ARROW_PAD : 'auto',
            paddingRight: orbitOnLeft ? 0 : SHADOW_PAD,
            marginRight: orbitOnLeft ? 0 : -SHADOW_PAD,
            paddingLeft: !orbitOnLeft ? 0 : SHADOW_PAD,
            marginLeft: !orbitOnLeft ? 0 : -SHADOW_PAD,
          }}
        >
          <orbit
            css={{
              width: size[0],
              borderLeftRadius,
              borderRightRadius,
              ...(hidden ? hiddenAnimation : showingAnimation),
            }}
            $orbitAnimate={willAnimate}
          >
            <orbitBorder
              css={{
                borderLeftRadius: borderLeftRadius ? borderLeftRadius - 1 : 0,
                borderRightRadius: borderRightRadius
                  ? borderRightRadius - 1
                  : 0,
                boxShadow: [borderShadow, [orbitLightShadow]].filter(Boolean),
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
    },
    orbitBorder: {
      pointerEvents: 'none',
      userSelect: 'none',
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
      position: 'relative',
      flex: 1,
    },
    orbitAnimate: {
      willChange: 'transform, opacity',
      transition: `
        transform ease-in ${App.animationDuration}ms,
        opacity ease-in ${App.animationDuration}ms
      `,
    },
    // used to hide edge overlap of drawer during in animation
    overflowWrap: {
      // overflow: 'hidden',
      alignSelf: 'flex-end',
      flex: 1,
      position: 'relative',
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
    orbitTorn: {
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

  static theme = (props, theme) => ({
    orbitFrame: {
      color: theme.base.color,
    },
  })
}
