import * as React from 'react'
import { view } from '@mcro/black'
import OrbitCard from './orbitCard'
import { App } from '@mcro/all'

const SPLIT_INDEX = 3

@view.attach('appStore')
@view
export default class OrbitSearchResults {
  render({ appStore }) {
    const { query, results, message } = appStore.searchState
    const isChanging = App.state.query !== query
    return (
      <orbitSearchResults $visible={!!App.state.query} $isChanging={isChanging}>
        <space css={{ height: 10 }} />
        <message if={message}>{message}</message>
        <results
          if={results.length}
          css={{
            opacity:
              query ||
              (appStore.activeIndex >= 0 && appStore.activeIndex < SPLIT_INDEX)
                ? 1
                : 0.5,
          }}
        >
          {(results || []).map((result, index) => (
            <OrbitCard
              key={`${index}${result.identifier || result.id}`}
              index={index}
              total={results.length}
              result={result}
              listItem
              hoverToSelect
            />
          ))}
        </results>
        <space css={{ height: 20 }} />
      </orbitSearchResults>
    )
  }

  static style = {
    orbitSearchResults: {
      flex: 1,
      opacity: 0,
      pointerEvents: 'none',
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
