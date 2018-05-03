import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App } from '@mcro/all'
import OrbitCard from './orbitCard'
import OrbitHomeHeader from './orbitHome/orbitHomeHeader'
import Masonry from '~/views/masonry'

class OrbitHomeStore {
  @react({ fireImmediately: true, log: false })
  setExploreResults = [
    () => !!App.state.query,
    hasQuery => {
      if (this.props.appStore.selectedPane !== 'summary') {
        return
      }
      const { appStore } = this.props
      if (hasQuery) {
        appStore.setGetResults(null)
      } else {
        appStore.setGetResults(() => appStore.summaryResults)
      }
    },
  ]
}

@view.provide({
  store: OrbitHomeStore,
})
@UI.injectTheme
@view
export default class OrbitHome {
  render({ appStore, theme }) {
    return (
      <pane css={{ background: theme.base.background }}>
        <OrbitHomeHeader theme={theme} />
        <summary>
          <Masonry>
            {appStore.summaryResults.map((bit, index) => (
              <OrbitCard
                pane="summary"
                key={index}
                index={index}
                bit={bit}
                total={appStore.summaryResults.length}
                hoverToSelect
                expanded
                getRef={appStore.setDockedResultRef(index)}
              />
            ))}
          </Masonry>
        </summary>
      </pane>
    )
  }

  static style = {
    pane: {
      flex: 1,
    },
    summary: {
      flex: 1,
      position: 'relative',
      transition: 'opacity ease-in-out 150ms',
      overflowY: 'scroll',
      padding: [0, 8],
    },
  }
}
