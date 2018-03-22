import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron, Desktop } from '@mcro/all'
import * as Constants from '~/constants'

const SHADOW_PAD = 15
const BORDER_RADIUS = 12
const background = 'rgba(0,0,0,0.9)'
const orbitShadow = [[0, 3, SHADOW_PAD, [0, 0, 0, 0.3]]]
const orbitLightShadow = [[0, 3, SHADOW_PAD, [0, 0, 0, 0.1]]]

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

@view({
  store: class OrbitFrameStore {
    @react
    isChanging = [
      () => [
        Electron.orbitState.fullScreen,
        Electron.orbitState.hasPositionedFullScreen,
        Desktop.state.appState.id,
        ...(Desktop.state.appState.bounds || []),
        ...(Desktop.state.appState.offset || []),
      ],
      async ([fullScreen, hasPositionedFS], { sleep, setValue }) => {
        if (fullScreen && !hasPositionedFS) {
          return true
        }
        if (fullScreen) {
          return false
        }
        setValue(true)
        await sleep(250)
        return false
      },
      true,
    ]
  },
})
export default class OrbitFrame {
  render({ store, orbitPage, children, iWidth }) {
    const { isChanging } = store
    if (isChanging) {
      return null
    }
    const { onLeft } = Electron
    const { fullScreen, arrowTowards } = Electron.orbitState
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
    return (
      <UI.Theme name="dark">
        <overflowWrap
          $hideOverflow={hideOverflow}
          css={
            fullScreen
              ? { right: 0 }
              : {
                  right: onLeft ? 15 : 'auto',
                  left: !onLeft ? 15 : 'auto',
                }
          }
          $isChangingApps={isChanging}
        >
          <orbit
            css={{
              paddingRight: fullScreen ? 0 : SHADOW_PAD,
            }}
            $orbitHeight={orbitPage.adjustHeight}
            $orbitStyle={[App.isShowingOrbit, onLeft, iWidth]}
            $orbitVisible={App.isShowingOrbit}
            $orbitFullScreen={fullScreen}
            $isChangingApps={isChanging}
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
    isChangingApps: {
      transition: 'none !important',
      opacity: 0,
    },
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
      willChange: 'transform, opacity',
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
    orbitStyle: ([isShowing, onLeft, iWidth]) => {
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
  }
}
