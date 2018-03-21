import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'

const SHADOW_PAD = 15

@view({
  store: class OrbitFrameStore {
    @react
    delayOnLeft = [
      () => Electron.onLeft,
      async (val, { sleep, setValue }) => {
        setValue(true)
        await sleep(64)
        return false
      },
      true,
    ]
  },
})
export default class OrbitFrame {
  render({ store, orbitPage, children, iWidth }) {
    const { delayOnLeft } = store
    const { onLeft } = Electron
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
          $isChangingApps={delayOnLeft}
        >
          <orbit
            css={{
              paddingRight: fullScreen ? 0 : SHADOW_PAD,
            }}
            $orbitHeight={orbitPage.adjustHeight}
            $orbitStyle={[App.isShowingOrbit, onLeft, iWidth]}
            $orbitVisible={App.isShowingOrbit}
            $orbitFullScreen={fullScreen}
            $isChangingApps={delayOnLeft}
          >
            {children}
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
  }
}
