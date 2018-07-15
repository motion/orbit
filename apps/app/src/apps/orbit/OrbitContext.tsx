import * as React from 'react'
import { view, attachTheme } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitFrame } from './OrbitFrame'
import { OrbitSearchResults } from './OrbitSearchResults'
import { OrbitHeader } from './OrbitHeader'
import { App } from '@mcro/stores'
import { OrbitContextHome } from './OrbitContextHome'

class PaneStore {
  get activePane() {
    if (App.state.query) {
      return 'search'
    }
    return 'context'
  }
}

@attachTheme
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
}

export const OrbitContext = props => (
  <UI.Theme name="dark">
    <Orbit {...props} />
  </UI.Theme>
)
