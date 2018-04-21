import * as React from 'react'
import { view } from '@mcro/black'
import OrbitCard from './orbitCard'
import OrbitHomeContext from './orbitHomeContext'
import { App } from '@mcro/all'
import * as UI from '@mcro/ui'

@UI.injectTheme
@view.attach('appStore')
@view
export default class OrbitHome {
  render({ appStore, theme }) {
    const { summaryResults, contextResults } = appStore
    if (!summaryResults.length) {
      return null
    }
    const hasQuery = App.state.query
    const maxHeight = Math.max(
      appStore.innerHeight * 0.75,
      appStore.innerHeight - contextResults.length * 80,
    )
    return (
      <orbitHome
        css={{
          opacity: hasQuery ? 0 : 1,
        }}
      >
        <space css={{ height: 10 }} />
        <summary if={summaryResults.length} css={{ maxHeight }}>
          <title css={{ alignItems: 'center', padding: [4, 0, 12] }}>
            <UI.Title
              size={0.9}
              fontWeight={600}
              color={theme.base.color}
              css={{ padding: [0, 15], textAlign: 'center' }}
            >
              Friday's Highlights
            </UI.Title>
          </title>
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
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    summary: {
      position: 'relative',
      transition: 'opacity ease-in-out 150ms',
      overflowY: 'scroll',
    },
  }
}
