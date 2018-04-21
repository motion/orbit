import * as React from 'react'
import { view } from '@mcro/black'
import OrbitCard from './orbitCard'
import OrbitHomeContext from './orbitHomeContext'
import { App } from '@mcro/all'
import * as UI from '@mcro/ui'

const Title = UI.injectTheme(({ center, theme, children, ...props }) => (
  <UI.Title
    fontWeight={600}
    color={theme.base.color}
    css={{
      padding: [0, 15],
      alignSelf: 'center',
      alignItems: center ? 'center' : 'flex-start',
    }}
    {...props}
  >
    {children}
  </UI.Title>
))

const SubTitle = props => (
  <Title
    size={0.9}
    fontWeight={400}
    css={{ textTransform: 'uppercase', opacity: 0.5 }}
    {...props}
  />
)

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

          <SubTitle>Three Slack Conversations</SubTitle>
          <OrbitCard
            index={0}
            total={summaryResults.length}
            result={summaryResults[0]}
            hoverToSelect
          />

          <SubTitle>One Document</SubTitle>
          <OrbitCard
            index={1}
            total={summaryResults.length}
            result={summaryResults[1]}
            hoverToSelect
          />

          <SubTitle>Two Issues</SubTitle>
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
    },
    summary: {
      position: 'relative',
      transition: 'opacity ease-in-out 150ms',
      overflowY: 'scroll',
    },
  }
}
