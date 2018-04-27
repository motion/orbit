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
    const maxHeight = Math.max(
      appStore.innerHeight * 0.75,
      appStore.innerHeight - results.length * 80,
    )
    return (
      <summary if={results.length} css={{ maxHeight, marginTop: 10 }}>
        <section>
          <OrbitCard
            index={0}
            total={results.length}
            result={results[0]}
            hoverToSelect
            getRef={appStore.setResultRef(0)}
          />
          <OrbitCard
            index={1}
            total={results.length}
            result={results[1]}
            hoverToSelect
            getRef={appStore.setResultRef(1)}
          />
          <OrbitCard
            index={2}
            total={results.length}
            result={results[2]}
            hoverToSelect
            getRef={appStore.setResultRef(2)}
          />
        </section>
        <verticalSpace />
        <SubTitle>Documents</SubTitle>
        <section>
          <OrbitCard
            index={3}
            total={results.length}
            result={results[3]}
            hoverToSelect
            getRef={appStore.setResultRef(3)}
          />
        </section>
        <verticalSpace />
        <SubTitle>Email</SubTitle>
        <section>
          <OrbitCard
            index={4}
            total={results.length}
            result={results[4]}
            hoverToSelect
            getRef={appStore.setResultRef(4)}
          />
          <OrbitCard
            index={5}
            total={results.length}
            result={results[5]}
            hoverToSelect
            getRef={appStore.setResultRef(5)}
          />
        </section>
      </summary>
    )
  }

  static style = {
    verticalSpace: {
      height: 5,
    },
    summary: {
      position: 'relative',
      transition: 'opacity ease-in-out 150ms',
      overflowY: 'scroll',
    },
    section: {
      padding: [0, 4],
    },
  }
}
