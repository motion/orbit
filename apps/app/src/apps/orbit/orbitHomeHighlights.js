import * as React from 'react'
import { view } from '@mcro/black'
import OrbitCard from './orbitCard'
import { Title, SubTitle, Circle } from '~/views'

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
  }
}
