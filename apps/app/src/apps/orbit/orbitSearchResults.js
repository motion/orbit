import * as React from 'react'
import { view, react } from '@mcro/black'
import { App } from '@mcro/all'
import { OrbitCard } from './orbitCard'
import { OrbitDockedPane } from './orbitDockedPane'

class SearchStore {
  state = react(
    () => this.props.appStore.searchState,
    state => {
      if (this.props.appStore.selectedPane !== this.props.name) {
        throw react.cancel
      }
      return state
    },
    { immediate: true },
  )

  hasQuery() {
    return !!App.state.query
  }
}

@view.attach('appStore')
@view({
  searchStore: SearchStore,
})
export class OrbitSearchResults {
  render({ searchStore, name }) {
    if (!searchStore.state) {
      return null
    }
    const { query, results, message } = searchStore.state
    const isChanging = App.state.query !== query
    log(`SEARCH ${name} --------------`)
    return (
      <OrbitDockedPane name="search" extraCondition={searchStore.hasQuery}>
        <contents $$flex $isChanging={isChanging}>
          <message if={message}>{message}</message>
          <results if={results.length}>
            {results.map((bit, index) => (
              <OrbitCard
                pane={name}
                key={`${index}${bit.identifier || bit.id}`}
                index={index}
                total={results.length}
                bit={bit}
                listItem
                expanded={false}
                hoverToSelect
              />
            ))}
          </results>
          <space css={{ height: 20 }} />
        </contents>
      </OrbitDockedPane>
    )
  }

  static style = {
    orbitSearchResults: {
      opacity: 0,
      pointerEvents: 'none',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    visible: {
      opacity: 1,
      pointerEvents: 'all',
    },
    isChanging: {
      opacity: 0.7,
    },
    message: {
      padding: [5, 10],
      fontSize: 12,
      opacity: 0.3,
    },
    results: {
      position: 'relative',
      transition: 'opacity ease-in-out 150ms',
    },
  }
}
