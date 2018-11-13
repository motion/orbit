import * as React from 'react'
import { ProvideHighlightsContextWithDefaults } from '../../helpers/contexts/HighlightsContext'
import { View, Row, Text } from '@mcro/ui'
import { Icon } from '../../views/Icon'
import { AppProps } from '../AppProps'
import { useStore } from '@mcro/use-store'
import { Separator } from '../../views/Separator'
import { TopicEdit } from './TopicEdit'
import { memo } from '../../helpers/memo'

const icons = {
  0: ['neutral', 'rgba(255,255,255,0.25)'],
  1: ['upArrow', 'rgb(34, 127, 34)'],
  2: ['downArrow', 'rgb(167, 34, 34)'],
}

class TopicsIndexStore {
  props: AppProps

  get results() {
    const { setting } = this.props.settingStore
    const topics = [...new Set(setting.values.topTopics || [])]
    return topics.map((topic, i) => ({
      title: topic,
      content: 'hello world',
      iconProps: {
        name: icons[i % 3][0],
        size: 9,
        fill: icons[i % 3][1],
      },
    }))
  }
}

function TopicList({ results }) {
  return (
    <>
      {results.map(res => (
        <Row key={res.title} {...{ padding: [10, 14], width: '50%' }}>
          <View paddingRight={10} margin={['auto', 0]}>
            <Icon {...res.iconProps} />
          </View>
          <View flex={1}>
            <Text size={1.2}>{res.title}</Text>
          </View>
        </Row>
      ))}
    </>
  )
}

export const TopicsAppIndex = memo((props: AppProps & { store?: TopicsIndexStore }) => {
  const store = useStore(TopicsIndexStore, props)
  return (
    <ProvideHighlightsContextWithDefaults
      value={{ words: ['app'], maxChars: 500, maxSurroundChars: 80 }}
    >
      {!!store.results.length && (
        <>
          <Separator>Trending</Separator>
          <View flexFlow="row" flexWrap="wrap">
            <TopicList results={store.results.slice(0, 10)} />
          </View>
        </>
      )}

      {!!store.results.length && (
        <>
          <Separator>Me</Separator>
          <View flexFlow="row" flexWrap="wrap">
            <TopicList results={store.results.slice(10, 20)} />
          </View>
        </>
      )}

      <TopicEdit />
    </ProvideHighlightsContextWithDefaults>
  )
})
