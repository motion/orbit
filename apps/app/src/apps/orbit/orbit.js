// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import OrbitContent from './orbitContent'
import OrbitSettings from './orbitSettings'
import OrbitHeader from './orbitHeader'
import OrbitStore from './orbitStore'

const SHADOW_PAD = 15
const BORDER_RADIUS = 12
// const BORDER_COLOR = `rgba(255,255,255,0.25)`
const background = 'rgba(0,0,0,0.9)'
const orbitShadow = [[0, 3, SHADOW_PAD, [0, 0, 0, 0.3]]]
const orbitLightShadow = [[0, 3, SHADOW_PAD, [0, 0, 0, 0.1]]]
const log = debug('orbit')

const OrbitArrow = ({ arrowSize, arrowTowards, arrowStyle }) =>
  [1, 2].map(key => (
    <UI.Arrow
      key={key}
      size={arrowSize}
      towards={arrowTowards}
      background={background}
      css={{
        position: 'absolute',
        ...arrowStyle,
        ...[
          {
            boxShadow: orbitShadow,
            zIndex: -1,
          },
          {
            zIndex: 100,
          },
        ][key],
      }}
    />
  ))

@view.provide({
  orbitStore: OrbitStore,
})
@view.attach('orbitStore')
@view
export default class OrbitPage {
  render({ orbitStore }) {
    const arrowTowards = Electron.orbitState.arrowTowards || 'right'
    const towardsRight = arrowTowards === 'right'
    const arrowSize = 24
    let arrowStyle
    switch (arrowTowards) {
      case 'right':
        arrowStyle = {
          top: 53,
          right: SHADOW_PAD - arrowSize,
        }
        break
      case 'left':
        arrowStyle = {
          top: 53,
          left: 1,
        }
        break
    }
    return (
      <UI.Theme name="dark">
        <indicator
          css={{
            position: 'absolute',
            background: 'red',
            width: 3,
            height: 35,
            top: 20,
            right: towardsRight ? SHADOW_PAD : 'auto',
            left: !towardsRight ? SHADOW_PAD : 'auto',
            borderLeftRadius: towardsRight ? 5 : 0,
            borderRightRadius: !towardsRight ? 5 : 0,
          }}
        />
        <overflowWrap
          $unPad={Electron.orbitState.fullScreen}
          $hideOverflow={!App.isShowingOrbit || App.isAnimatingOrbit}
        >
          <orbit
            css={{
              paddingRight: Electron.orbitState.fullScreen ? 0 : SHADOW_PAD,
            }}
            $orbitStyle={[App.isShowingOrbit, towardsRight]}
            $orbitVisible={App.isShowingOrbit}
            $orbitFullScreen={Electron.orbitState.fullScreen}
          >
            {/* first is arrow (above), second is arrow shadow (below) */}
            <OrbitArrow
              if={App.isAttachedToWindow}
              arrowSize={arrowSize}
              arrowTowards={arrowTowards}
              arrowStyle={arrowStyle}
            />
            <content
              css={{
                boxShadow: Electron.orbitState.fullScreen
                  ? orbitShadow
                  : orbitLightShadow,
                borderLeftRadius: towardsRight ? BORDER_RADIUS : 0,
                borderRightRadius:
                  Electron.orbitState.fullScreen || towardsRight
                    ? 0
                    : BORDER_RADIUS,
              }}
            >
              <OrbitHeader />
              <OrbitContent if={!orbitStore.showSettings} />
              <OrbitSettings if={orbitStore.showSettings} />
              <Knowledge if={App.state.knowledge} data={App.state.knowledge} />
              <controls>
                <UI.Button
                  icon="gear"
                  borderRadius={100}
                  size={1.1}
                  circular
                  chromeless
                  highlight={orbitStore.showSettings}
                  onClick={orbitStore.toggleSettings}
                />
              </controls>
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
      right: 15,
      position: 'relative',
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
      height: '100%',
      padding: SHADOW_PAD,
      pointerEvents: 'none !important',
      position: 'relative',
      transition: `
        transform linear ${App.animationDuration}ms,
        opacity linear ${App.animationDuration}ms
      `,
      opacity: 0,
      // background: 'red',
    },
    orbitStyle: ([isShowing, towardsRight]) => {
      if (!isShowing) {
        return {
          marginRight: towardsRight ? SHADOW_PAD : -SHADOW_PAD,
          transform: {
            x: towardsRight ? 25 : -25,
          },
        }
      }
    },
    orbitVisible: {
      pointerEvents: 'all !important',
      opacity: 1,
      marginRight: 0,
      transform: {
        x: 0,
      },
    },
    orbitFullScreen: {
      width: '100%',
      right: 0,
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
    controls: {
      position: 'absolute',
      bottom: 15,
      right: 12,
      zIndex: 10000,
      opacity: 0.2,
      '&:hover': {
        opacity: 0.9,
      },
    },
  }
}
