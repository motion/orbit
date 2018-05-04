import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import OrbitHome from './orbitHome'
import OrbitSettings from './orbitSettings'
import OrbitHomeHeader from './orbitHomeHeader'
import OrbitHeader from './orbitHeader'
import OrbitSearchResults from './orbitSearchResults'
import OrbitDirectory from './orbitDirectory'
import { App } from '@mcro/all'

const SHADOW_PAD = 85
const DOCKED_SHADOW = [0, 0, SHADOW_PAD, [0, 0, 0, 0.2]]

class DockedStore {
  filters = ['all', 'general', 'status', 'showoff']
  mainPanes = ['home', 'explore', 'directory']
  paneIndex = 0
  panes = [...this.mainPanes, ...this.filters]

  get isActive() {
    return this.props.appStore.selectedPane === 'summary'
  }

  get activePane() {
    if (!this.isActive) {
      return null
    }
    if (App.state.query) {
      return 'search'
    }
    return this.panes[this.paneIndex]
  }

  @react({
    log: false,
    defaultValue: { willAnimate: false, visible: false },
  })
  animationState = [
    () => App.orbitState.docked,
    async (visible, { sleep, setValue }) => {
      // old value first to setup for transition
      setValue({ willAnimate: true, visible: !visible })
      await sleep(32)
      // new value, start transition
      setValue({ willAnimate: true, visible })
      await sleep(App.animationDuration)
      // done animating, reset
      setValue({ willAnimate: false, visible })
    },
  ]
}

@UI.injectTheme
@view.attach('appStore')
@view({
  dockedStore: DockedStore,
})
class OrbitDocked {
  render({ dockedStore, appStore, theme }) {
    const { visible, willAnimate } = dockedStore.animationState
    const background = theme.base.background
    const borderColor = theme.base.background.darken(0.25).desaturate(0.6)
    const borderShadow = ['inset', 0, 0, 0, 0.5, borderColor]
    return (
      <frame
        $willAnimate={willAnimate}
        $visible={visible}
        css={{ background, boxShadow: [borderShadow, DOCKED_SHADOW] }}
      >
        <OrbitHeader />
        <orbitInner>
          <UI.Button
            $settingsButton
            icon="gear"
            borderRadius={100}
            size={1.05}
            sizeIcon={1.2}
            circular
            borderWidth={0}
            background={theme.base.background}
            iconProps={{
              color: theme.active.background.darken(0.1),
            }}
            onClick={appStore.toggleSettings}
          />
          <OrbitHomeHeader dockedStore={dockedStore} theme={theme} />
          <OrbitHome
            isActive={dockedStore.activePane === 'home'}
            appStore={appStore}
          />
          <OrbitDirectory
            isActive={dockedStore.activePane === 'directory'}
            appStore={appStore}
          />
          <OrbitSearchResults
            isActive={dockedStore.isActive && !!App.state.query}
            parentPane="summary"
          />
          <OrbitSettings />
        </orbitInner>
      </frame>
    )
  }

  static style = {
    frame: {
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 2,
      flex: 1,
      pointerEvents: 'none',
      width: App.dockedWidth,
      height: '100%',
      opacity: 0,
      transform: {
        x: 10,
      },
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
  <UI.Theme name="tan">
    <OrbitDocked {...props} />
  </UI.Theme>
)
