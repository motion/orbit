import * as React from 'react'
import { view } from '@mcro/black'
import OrbitCard from './orbitCard'
import { SubTitle } from '~/views'

@view.attach('appStore')
@view
export default class OrbitHomeHighlights {
  render({ results, appStore }) {
    if (!results || !results.length) {
      return null
    }
    return (
      <summary if={results.length} css={{ marginTop: 5 }}>
        <section $grid>
          {[0, 1, 2, 3, 4, 5, 6, 7].map(item => (
            <OrbitCard
              key={item}
              index={item}
              total={results.length}
              result={results[item]}
              hoverToSelect
              expanded
              getRef={appStore.setResultRef(item)}
              css={{
                width: '50%',
                marginBottom: 8,
              }}
            />
          ))}
        </section>
      </summary>
    )
  }

  static style = {
    summary: {
      flex: 1,
      position: 'relative',
      transition: 'opacity ease-in-out 150ms',
      overflowY: 'scroll',
    },
    grid: {
      padding: [0, 5],
      flexFlow: 'row',
      flexWrap: 'wrap',
    },
  }
}
