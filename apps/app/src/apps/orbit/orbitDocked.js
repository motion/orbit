import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitHome } from './orbitHome'
import { OrbitSettings } from './orbitSettings'
import { OrbitHomeHeader } from './orbitHomeHeader'
import { OrbitHeader } from './orbitHeader'
import { OrbitSearchResults } from './orbitSearchResults'
import { OrbitDirectory } from './orbitDirectory'
import { App, Electron } from '@mcro/all'

const SHADOW_PAD = 85
const DOCKED_SHADOW = [0, 0, SHADOW_PAD, [0, 0, 0, 0.3]]

class PaneStore {
  filters = ['all', 'general', 'status', 'showoff']
  mainPanes = ['home', 'directory', 'settings']
  paneIndex = 0
  panes = [...this.mainPanes, ...this.filters]

  willMount() {
    this.on(this.props.orbitStore, 'key', key => {
      if (key === 'right') {
        this.paneIndex = Math.min(this.panes.length - 1, this.paneIndex + 1)
      }
      if (key === 'left') {
        this.paneIndex = Math.max(0, this.paneIndex - 1)
      }
    })
  }

  setActivePane = name => {
    this.paneIndex = this.panes.findIndex(val => val === name)
  }

  get activePane() {
    if (!App.orbitState.docked) {
      return this.panes[this.paneIndex]
    }
    if (App.state.query) {
      return 'search'
    }
    return this.panes[this.paneIndex]
  }

  clearPeekOnActivePaneChange = react(() => this.activePane, App.clearPeek, {
    log: 'state',
  })

  animationState = react(
    () => App.orbitState.docked,
    async (visible, { sleep, setValue }) => {
      // hmr already showing
      if (visible && this.animationState.visible) {
        throw react.cancel
      }
      // old value first to setup for transition
      setValue({ willAnimate: true, visible: !visible })
      await sleep(32)
      // new value, start transition
      setValue({ willAnimate: true, visible })
      await sleep(App.animationDuration * 2)
      // done animating, reset
      setValue({ willAnimate: false, visible })
      App.sendMessage(
        Electron,
        visible ? Electron.messages.FOCUS : Electron.messages.DEFOCUS,
      )
    },
    {
      immediate: true,
      log: false,
      defaultValue: { willAnimate: false, visible: App.orbitState.docked },
    },
  )
}

const borderRadius = 14

@UI.injectTheme
@view.attach('appStore', 'orbitStore')
@view.provide({
  paneStore: PaneStore,
})
@view
class OrbitDocked {
  render({ paneStore, appStore, theme }) {
    log('DOCKED ------------', paneStore.animationState)
    const { visible, willAnimate } = paneStore.animationState
    return (
      <>
        <bgGradient if={false} $$fullscreen $visible={visible} />
        <frame $willAnimate={willAnimate} $visible={visible}>
          <border $$fullscreen />
          <container>
            <OrbitHeader
              after={<OrbitHomeHeader paneStore={paneStore} theme={theme} />}
            />
            <orbitInner>
              <OrbitHome appStore={appStore} paneStore={paneStore} />
              <OrbitDirectory
                name="directory"
                appStore={appStore}
                paneStore={paneStore}
              />
              <OrbitSearchResults name="summary-search" parentPane="summary" />
              <OrbitSettings name="settings" />
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
    return {
      frame: {
        background,
      },
      border: {
        borderRadius: borderRadius,
        boxShadow: [borderShadow, DOCKED_SHADOW],
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
        x: 10,
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
        transform ease-in ${App.animationDuration * 0.8}ms,
        opacity ease-in ${App.animationDuration * 0.8}ms
      `,
    },
    visible: {
      pointerEvents: 'auto',
      opacity: 1,
      transform: {
        x: 0,
      },
    },
    orbitInner: {
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
  }
}

export default props => (
  <UI.Theme name="grey">
    <OrbitDocked {...props} />
  </UI.Theme>
)
