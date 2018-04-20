import * as React from 'react'
import { view } from '@mcro/black'
import OrbitCard from './orbitCard'
import OrbitHomeContext from './orbitHomeContext'

@view.attach('appStore')
@view
export default class OrbitHome {
  render({ appStore }) {
    const { summaryResults } = appStore
    if (!summaryResults.length) {
      return null
    }
    return (
      <orbitHome>
        <space css={{ height: 10 }} />
        <summary
          if={summaryResults.length}
          css={{
            opacity: 1,
          }}
        >
          {summaryResults.map((result, index) => (
            <OrbitCard
              key={`${index}${result.identifier || result.id}`}
              index={index}
              total={summaryResults.length}
              result={result}
              hoverToSelect
            />
          ))}
        </summary>
        <OrbitHomeContext appStore={appStore} />
        <space css={{ height: 20 }} />
      </orbitHome>
    )
  }

  static style = {
    orbitHome: {
      flex: 1,
    },
    summary: {
      position: 'relative',
      transition: 'opacity ease-in-out 150ms',
    },
  }
}
