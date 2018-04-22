import * as React from 'react'
import { view } from '@mcro/black'
import OrbitCard from './orbitCard'
import OrbitHomeContext from './orbitHomeContext'
import { App } from '@mcro/all'
import * as UI from '@mcro/ui'
import { Title, SubTitle, Circle } from '~/views'

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
          <Title center>Friday's Highlights</Title>

          <SubTitle>
            <Circle>3</Circle> Conversations
          </SubTitle>
          <OrbitCard
            index={0}
            total={summaryResults.length}
            result={summaryResults[0]}
            hoverToSelect
          />
          <verticalSpace />
          <SubTitle>
            <Circle>1</Circle> Document
          </SubTitle>
          <OrbitCard
            index={1}
            total={summaryResults.length}
            result={summaryResults[1]}
            hoverToSelect
          />
          <verticalSpace />
          <SubTitle>
            <Circle>2</Circle> Issues
          </SubTitle>
          <OrbitCard
            index={2}
            total={summaryResults.length}
            result={summaryResults[2]}
            hoverToSelect
          />
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
      padding: [8, 0, 0],
    },
    summary: {
      position: 'relative',
      transition: 'opacity ease-in-out 150ms',
      overflowY: 'scroll',
    },
    verticalSpace: {
      height: 5,
    },
  }
}
