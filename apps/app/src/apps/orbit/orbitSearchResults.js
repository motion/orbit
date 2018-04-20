import * as React from 'react'
import { view } from '@mcro/black'
import OrbitCard from './orbitCard'

const SPLIT_INDEX = 3

@view.attach('appStore')
@view
export default class OrbitSearchResults {
  render({ appStore }) {
    const { query, results, message } = appStore
    return (
      <orbitSearchResults $visible={!!query}>
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
          {results.map((result, index) => (
            <OrbitCard
              key={`${index}${result.identifier || result.id}`}
              index={index}
              total={results.length}
              result={result}
              listItem
              hoverToSelect={appStore.activeIndex >= SPLIT_INDEX}
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
    },
    visible: {
      opacity: 1,
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
