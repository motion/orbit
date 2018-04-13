import * as React from 'react'
import { view } from '@mcro/black'
import OrbitCard from './orbitCard'
import OrbitContext from './orbitContext'

const SPLIT_INDEX = 3

@view.attach('appStore')
@view
export default class OrbitContent {
  render({ appStore }) {
    const { query, results } = appStore.searchState
    const hasQuery = query.length > 0
    log(`content ${query}`)
    return (
      <orbitContent>
        <space css={{ height: 10 }} />
        <notifications
          if={results.length}
          $tiny={!hasQuery}
          css={{
            opacity:
              appStore.activeIndex >= 0 && appStore.activeIndex < SPLIT_INDEX
                ? 1
                : 0.5,
          }}
        >
          {results
            .slice(0, hasQuery ? 12 : SPLIT_INDEX)
            .map((result, index) => (
              <OrbitCard
                tiny={!hasQuery}
                key={`${index}${result.identifier || result.id}`}
                index={index}
                total={results.length}
                result={result}
                listItem
              />
            ))}
        </notifications>
        <OrbitContext if={!hasQuery} appStore={appStore} />
        <space css={{ height: 20 }} />
      </orbitContent>
    )
  }

  static style = {
    orbitContent: {
      flex: 1,
    },
    tiny: {
      margin: [0, 10],
    },
    notifications: {
      position: 'relative',
      transition: 'opacity ease-in-out 150ms',
    },
  }
}
