import * as React from 'react'
import { view } from '@mcro/black'
import OrbitCard from './orbitCard'
import { SubTitle } from '~/views'

@view.attach('appStore')
@view
export default class OrbitHomeHighlights {
  render({ appStore }) {
    const { summaryResults, contextResults } = appStore
    if (!summaryResults.length) {
      return null
    }
    const maxHeight = Math.max(
      appStore.innerHeight * 0.75,
      appStore.innerHeight - contextResults.length * 80,
    )
    return (
      <summary if={summaryResults.length} css={{ maxHeight, marginTop: 10 }}>
        <section css={{ margin: [0, -5] }}>
          <OrbitCard
            index={0}
            total={summaryResults.length}
            result={summaryResults[0]}
            hoverToSelect
            expanded
            getRef={appStore.setResultRef(0)}
          />
          <OrbitCard
            index={1}
            total={summaryResults.length}
            result={summaryResults[1]}
            hoverToSelect
            expanded={false}
            getRef={appStore.setResultRef(1)}
          />
          <OrbitCard
            index={2}
            total={summaryResults.length}
            result={summaryResults[2]}
            hoverToSelect
            expanded={false}
            getRef={appStore.setResultRef(2)}
          />
        </section>
        <verticalSpace />
        <SubTitle>Documents</SubTitle>
        <section>
          <OrbitCard
            index={3}
            total={summaryResults.length}
            result={summaryResults[3]}
            hoverToSelect
            expanded={false}
            listItem
            getRef={appStore.setResultRef(3)}
          />
        </section>
        <verticalSpace />
        <SubTitle>Email</SubTitle>
        <section>
          <OrbitCard
            index={4}
            total={summaryResults.length}
            result={summaryResults[4]}
            hoverToSelect
            expanded={false}
            listItem
            getRef={appStore.setResultRef(4)}
          />
          <OrbitCard
            index={5}
            total={summaryResults.length}
            result={summaryResults[5]}
            hoverToSelect
            expanded={false}
            listItem
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
