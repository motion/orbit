import * as React from 'react'
import { view, react } from '@mcro/black'
import OrbitCard from './orbitCard'
import { App } from '@mcro/all'
import OrbitDockedPane from './orbitDockedPane'

class SearchStore {
  @react({ immediate: true })
  state = [
    () => this.props.appStore.searchState,
    state => {
      if (this.props.appStore.selectedPane !== this.props.pane) {
        throw react.cancel
      }
      return state
    },
  ]
}

@view.attach('appStore')
@view({
  searchStore: SearchStore,
})
export default class OrbitSearchResults {
  render({ searchStore, parentPane }) {
    if (!searchStore.state) {
      return null
    }
    log(`SEARCH ${parentPane} --------------`)
    const pane = `${parentPane}-search`
    const { query, results, message } = searchStore.state
    const hasQuery = !!App.state.query
    const isChanging = App.state.query !== query
    return (
      <OrbitDockedPane
        name="search"
        extraCondition={() => hasQuery}
        $isChanging={isChanging}
      >
        <message if={message}>{message}</message>
        <results
          if={results.length}
          css={{
            opacity: !isChanging ? 1 : 0.5,
          }}
        >
          {results.map((bit, index) => (
            <OrbitCard
              pane={pane}
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
