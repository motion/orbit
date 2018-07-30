import * as React from 'react'
import { view, react, attachTheme } from '@mcro/black'
import { App, Electron } from '@mcro/stores'
import * as Constants from '../../constants'
import { OrbitArrow } from './OrbitArrow'
import { OrbitIndicator } from '../../views/OrbitIndicator'
import * as UI from '@mcro/ui'

const SHADOW_PAD = 85
const ARROW_PAD = 15

const OrbitBorder = view({
  pointerEvents: 'none',
  userSelect: 'none',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 10000000,
})

const Orbit = view({
  position: 'relative',
  flex: 1,
  orbitAnimate: {
    willChange: 'transform, opacity',
    transition: `
        transform ease-in ${App.animationDuration}ms,
        opacity ease-in ${App.animationDuration}ms
      `,
  },
})

// used to hide edge overlap of drawer during in animation
const OverflowWrap = view({
  // overflow: 'hidden',
  alignSelf: 'flex-end',
  flex: 1,
  position: 'relative',
})

const OrbitContent = view({
  flex: 1,
  overflow: 'hidden',
  opacity: 1,
  position: 'relative',
})

const Fade = view({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
  pointerEvents: 'none',
})

const Expand = view({
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
})

class FrameStore {
  animationState = react(
    () => App.orbitState.hidden,
    async (hidden, { sleep, setValue }) => {
      // old value first to setup for transition
      setValue({ willAnimate: true, hidden: !hidden })
      await sleep(32)
      // new value, start transition
      setValue({ willAnimate: true, hidden })
      await sleep(App.animationDuration * 2)
      // done animating, reset
      setValue({ willAnimate: false, hidden })
      if (App.orbitState.pinned) {
        App.sendMessage(
          Electron,
          App.orbitState.pinned
            ? Electron.messages.FOCUS
            : Electron.messages.DEFOCUS,
        )
      }
    },
    {
      immediate: true,
      defaultValue: { willAnimate: false, hidden: true },
    },
  )
}

const showingAnimation = {
  opacity: 1,
  transform: {
    x: 0,
  },
}

@attachTheme
@view.attach({
  store: FrameStore,
})
@view
export class OrbitFrame extends React.Component<{
  store: FrameStore
}> {
  render() {
    const { store, children, theme, headerBg } = this.props
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
      <UI.Col
        css={{
          color: theme.base.color,
          position: 'absolute',
          pointerEvents: hidden ? ' none' : 'auto',
          width: size[0],
          // TODO HACKINESS fix the size/y calc in orbitPosition.js
          height: size[1] - 5,
          transform: {
            x: position[0],
            y: position[1],
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
        <OverflowWrap
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
          <Orbit
            css={{
              width: size[0],
              borderLeftRadius,
              borderRightRadius,
              ...(hidden ? hiddenAnimation : showingAnimation),
            }}
            orbitAnimate={willAnimate}
          >
            <OrbitBorder
              css={{
                borderLeftRadius: borderLeftRadius ? borderLeftRadius - 1 : 0,
                borderRightRadius: borderRightRadius
                  ? borderRightRadius - 1
                  : 0,
                boxShadow: [borderShadow, [orbitLightShadow]].filter(Boolean),
              }}
            />
            <OrbitContent
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
              <Expand>
                <Fade
                  css={{
                    opacity: 1,
                    background: `linear-gradient(transparent, ${
                      theme.base.background
                    } 95%)`,
                  }}
                />
              </Expand>
            </OrbitContent>
          </Orbit>
        </OverflowWrap>
      </UI.Col>
    )
  }
}
