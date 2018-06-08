import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitFrame } from './orbitFrame'
import { OrbitSearchResults } from './orbitSearchResults'
import { OrbitHeader } from './orbitHeader'
import { App } from '@mcro/all'
import { OrbitContextHome } from './orbitContextHome'
import * as Constants from '~/constants'

class PaneStore {
  get activePane() {
    if (App.state.query) {
      return 'search'
    }
    return 'context'
  }
}

@UI.injectTheme
@view.attach('orbitPage')
@view.provide({
  paneStore: PaneStore,
})
@view
class Orbit extends React.Component {
  render({ orbitPage, theme }) {
    const headerBg = theme.base.background
    return (
      <OrbitFrame headerBg={headerBg} orbitPage={orbitPage}>
        <OrbitHeader showPin headerBg={headerBg} />
        <orbitInner>
          <OrbitContextHome />
          <OrbitSearchResults name="context-search" parentPane="context" />
        </orbitInner>
      </OrbitFrame>
    )
  }

  static style = {
    orbitInner: {
      position: 'relative',
      flex: 1,
      zIndex: 10,
    },
    orbitContext: {
      borderBottomRadius: Constants.BORDER_RADIUS,
      position: 'relative',
      height: 'calc(100% - 35px)',
      transition: 'transform ease-in-out 150ms',
      zIndex: 100,
    },
    contextHeader: {
      padding: [15, 0, 0],
    },
    results: {
      flex: 1,
    },
    fade: {
      position: 'fixed',
      left: 0,
      right: 0,
      top: 13,
      height: 60,
      opacity: 0,
      zIndex: 100000,
      transition: 'opacity ease-in-out 150ms',
    },
    fadeVisible: {
      zIndex: 10000,
      opacity: 1,
    },
  }

  static theme = (props, theme) => {
    return {
      fade: {
        background: `linear-gradient(${
          theme.base.background
        } 40%, transparent)`,
      },
      fadeNotifications: {
        background: `linear-gradient(transparent 45%, ${
          theme.base.background
        })`,
      },
    }
  }
}

export default props => (
  <UI.Theme name="dark">
    <Orbit {...props} />
  </UI.Theme>
)
