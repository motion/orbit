import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitHome } from './orbitHome'
import { OrbitSettings } from './orbitSettings'
import { OrbitHomeHeader } from './orbitHomeHeader'
import { OrbitHeader } from './orbitHeader'
import { OrbitSearchResults } from './orbitSearchResults'
import { OrbitDirectory } from './orbitDirectory'
import { App } from '@mcro/all'

const SHADOW_PAD = 85
const DOCKED_SHADOW = [0, 0, SHADOW_PAD, [0, 0, 0, 0.2]]

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

  get isShowingDocked() {
    return this.props.appStore.selectedPane === 'summary'
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

  animationState = react(
    () => App.orbitState.docked,
    async (visible, { sleep, setValue }) => {
      // old value first to setup for transition
      setValue({ willAnimate: true, visible: !visible })
      await sleep(32)
      // new value, start transition
      setValue({ willAnimate: true, visible })
      await sleep(App.animationDuration * 2)
      // done animating, reset
      setValue({ willAnimate: false, visible })
    },
    {
      immediate: true,
      log: false,
      defaultValue: { willAnimate: false, visible: false },
    },
  )
}

const borderRadius = 20

@UI.injectTheme
@view.attach('appStore', 'orbitStore')
@view.provide({
  paneStore: PaneStore,
})
@view
class OrbitDocked {
  render({ paneStore, appStore, theme }) {
    log('DOCKED ------------')
    const { visible, willAnimate } = paneStore.animationState
    const background = theme.base.background
    const borderColor = theme.base.background.darken(0.25).desaturate(0.6)
    const borderShadow = ['inset', 0, 0, 0, 0.5, borderColor]
    return (
      <frame $willAnimate={willAnimate} $visible={visible} css={{ background }}>
        <border
          $$fullscreen
          css={{
            borderRadius: borderRadius + 1,
            boxShadow: [borderShadow, DOCKED_SHADOW],
          }}
        />
        <container>
          <OrbitHeader
            after={<OrbitHomeHeader paneStore={paneStore} theme={theme} />}
          />
          <orbitInner>
            <OrbitHome name="home" appStore={appStore} paneStore={paneStore} />
            <OrbitDirectory
              name="directory"
              appStore={appStore}
              paneStore={paneStore}
            />
            <OrbitSearchResults
              name="summary-search"
              parentPane="summary"
              paneStore={paneStore}
            />
            <OrbitSettings />
          </orbitInner>
        </container>
      </frame>
    )
  }

  static style = {
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
        transform ease-in ${App.animationDuration / 2}ms,
        opacity ease-in ${App.animationDuration / 2}ms
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
