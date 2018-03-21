// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import OrbitContent from './orbitContent'
import OrbitSettings from './orbitSettings'
import OrbitHeader from './orbitHeader'
import OrbitStore from './orbitStore'
import * as Constants from '~/constants'

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

class OrbitPageStore {
  isDragging = false
  adjustHeight = 0

  willMount() {
    this.on(window, 'mousemove', e => {
      if (!this.isDragging) return
      const adjustHeight = Math.min(
        window.innerHeight - e.clientY - SHADOW_PAD * 2,
        window.innerHeight - 300, // no less than 300
      )
      console.log(adjustHeight)
      this.adjustHeight = adjustHeight
    })

    this.on(window, 'mouseup', () => {
      this.isDragging = false
    })
  }

  barMouseDown = () => {
    this.isDragging = true
  }
}

const iWidth = 4

@view.provide({
  orbitStore: OrbitStore,
})
@view.attach('orbitStore')
@view({
  orbitPage: OrbitPageStore,
})
export default class OrbitPage {
  render({ orbitStore, orbitPage }) {
    const arrowTowards = Electron.orbitState.arrowTowards || 'right'
    const onLeft = arrowTowards === 'right'
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
    const { fullScreen } = Electron.orbitState
    return (
      <UI.Theme name="dark">
        <overflowWrap
          $hideOverflow={!App.isShowingOrbit || App.isAnimatingOrbit}
          css={
            fullScreen
              ? { right: 0 }
              : {
                  right: onLeft ? 15 : 'auto',
                  left: !onLeft ? 15 : 'auto',
                }
          }
        >
          <orbit
            css={{
              paddingRight: fullScreen ? 0 : SHADOW_PAD,
            }}
            $orbitHeight={orbitPage.adjustHeight}
            $orbitStyle={[App.isShowingOrbit, onLeft]}
            $orbitVisible={App.isShowingOrbit}
            $orbitFullScreen={fullScreen}
          >
            <indicator
              if={!fullScreen}
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
            {/* first is arrow (above), second is arrow shadow (below) */}
            <OrbitArrow
              if={App.isAttachedToWindow}
              arrowSize={arrowSize}
              arrowTowards={arrowTowards}
              arrowStyle={arrowStyle}
            />
            <content
              css={{
                boxShadow: fullScreen ? orbitShadow : orbitLightShadow,
                borderLeftRadius: onLeft ? BORDER_RADIUS : 0,
                borderRightRadius: fullScreen || onLeft ? 0 : BORDER_RADIUS,
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
              <expand
                css={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  paddingTop: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexFlow: 'row',
                  zIndex: 1000,
                  borderBottomRadius: BORDER_RADIUS,
                  overflow: 'hidden',
                }}
              >
                <fade
                  css={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    top: 0,
                    background: `linear-gradient(transparent, #111 80%)`,
                  }}
                />
                <bar
                  css={{
                    flex: 1,
                    margin: 20,
                    height: 5,
                    borderRadius: 100,
                    background: [255, 255, 255, 0.1],
                    zIndex: 10,
                    cursor: 'ns-resize',
                  }}
                  onMouseDown={orbitPage.barMouseDown}
                />
              </expand>
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
      pointerEvents: 'none !important',
      position: 'relative',
      transition: `
        transform linear ${App.animationDuration}ms,
        opacity linear ${App.animationDuration}ms
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
    orbitStyle: ([isShowing, onLeft]) => {
      return isShowing
        ? {
            transform: {
              x: onLeft ? 0 : -SHADOW_PAD * 2,
            },
          }
        : {
            // marginRight: onLeft ? SHADOW_PAD : -SHADOW_PAD,
            transform: {
              x: onLeft ? 330 - SHADOW_PAD - (SHADOW_PAD + iWidth) + 4 : -330,
            },
          }
    },
    orbitVisible: {
      pointerEvents: 'all !important',
      opacity: 1, //0.5,
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
    controls: {
      position: 'absolute',
      bottom: 35,
      right: 12,
      zIndex: 10000,
      opacity: 0.2,
      '&:hover': {
        opacity: 0.9,
      },
    },
  }
}
