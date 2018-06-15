import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitHome } from './orbitHome'
import { OrbitSettings } from './orbitSettings'
import { OrbitHomeHeader } from './orbitHomeHeader'
import { OrbitHeader } from './orbitHeader'
import { OrbitSearchResults } from './orbitSearchResults'
import { OrbitDirectory } from './orbitDirectory'
import { App } from '@mcro/stores'
import { OrbitDockedPaneStore } from './orbitDockedPaneStore'

const borderRadius = 16
const SHADOW_PAD = 120
const DOCKED_SHADOW = [0, 0, SHADOW_PAD, [0, 0, 0, 0.3]]

@UI.injectTheme
@view.attach('appStore', 'orbitStore')
@view.provide({
  paneStore: OrbitDockedPaneStore,
})
@view
class OrbitDocked {
  render({ paneStore, appStore, theme }) {
    const { animationState } = paneStore
    log('DOCKED ------------', App.orbitState.docked)
    return (
      <>
        <frame
          $visible={animationState.visible}
          $willAnimate={animationState.willAnimate}
        >
          <border $$fullscreen />
          <container>
            <OrbitHeader
              after={<OrbitHomeHeader paneStore={paneStore} theme={theme} />}
            />
            <glowWrap>
              <glow />
            </glowWrap>
            <orbitInner>
              <orbitRelativeInner>
                <OrbitHome
                  name="home"
                  appStore={appStore}
                  paneStore={paneStore}
                />
                <OrbitDirectory
                  name="directory"
                  appStore={appStore}
                  paneStore={paneStore}
                />
                <OrbitSearchResults
                  name="summary-search"
                  parentPane="summary"
                />
                <OrbitSettings name="settings" />
              </orbitRelativeInner>
            </orbitInner>
          </container>
        </frame>
      </>
    )
  }

  static theme = (props, theme) => {
    const background = theme.base.background
    const borderColor = theme.base.background.darken(0.35).desaturate(0.6)
    const borderShadow = ['inset', 0, 0, 0, 0.5, borderColor]
    const borderGlow = ['inset', 0, 0, 0, 1, [255, 255, 255, 0.5]]
    return {
      frame: {
        background,
      },
      border: {
        borderRadius: borderRadius,
        boxShadow: [borderShadow, borderGlow, DOCKED_SHADOW],
      },
    }
  }

  static style = {
    bgGradient: {
      background: 'linear-gradient(to right, transparent 20%, rgba(0,0,0,0.6))',
      zIndex: -1,
      opacity: 0,
      transition: 'all ease-in 100ms',
    },
    frame: {
      position: 'absolute',
      top: 10,
      right: 10,
      bottom: 10,
      borderRadius,
      zIndex: 2,
      flex: 1,
      pointerEvents: 'none',
      width: App.dockedWidth,
      opacity: 0,
      transform: {
        x: 6,
      },
    },
    container: {
      borderRadius: borderRadius + 1,
      // overflow: 'hidden',
      flex: 1,
    },
    border: {
      zIndex: Number.MAX_SAFE_INTEGER,
      pointerEvents: 'none',
    },
    willAnimate: {
      willChange: 'transform, opacity',
      transition: `
        transform ease-in ${App.animationDuration}ms,
        opacity ease-in ${App.animationDuration}ms
      `,
    },
    visible: {
      pointerEvents: 'auto',
      opacity: 1,
      transform: {
        x: 0,
      },
    },
    // having this have -20 margin on sides
    // means we have nice shadows on inner content
    // that overlap the edge of the frame and dont cut off
    // but still hide things that go below the bottom as it should
    orbitInner: {
      overflow: 'hidden',
      margin: [0, -20],
      padding: [0, 20],
      flex: 1,
    },
    orbitRelativeInner: {
      position: 'relative',
      flex: 1,
    },
    settingsButton: {
      position: 'absolute',
      top: 0,
      right: 10,
      zIndex: 10000000000,
      transform: {
        y: -16.5,
      },
    },
    glowWrap: {
      pointerEvents: 'none',
      zIndex: -1,
      borderRadius,
      overflow: 'hidden',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      position: 'absolute',
    },
    glow: {
      background: '#fff',
      opacity: 1,
      top: 0,
      left: 0,
      width: 200,
      height: 200,
      position: 'absolute',
      transform: {
        x: '89%',
        scale: 2.5,
      },
      filter: {
        blur: 100,
      },
    },
  }
}

export default props => (
  <UI.Theme name="grey">
    <OrbitDocked {...props} />
  </UI.Theme>
)
