import * as React from 'react'
import { view, attach } from '@mcro/black'
import { ProvideHighlightsContextWithDefaults } from '../../helpers/contexts/HighlightsContext'
import { View, Row, Text } from '@mcro/ui'
import { Section } from '../../views/Section'
import { Icon } from '../../views/Icon'
import { AppProps } from '../AppProps'

const icons = {
  0: ['neutral', 'rgba(255,255,255,0.25)'],
  1: ['upArrow', 'rgb(34, 127, 34)'],
  2: ['downArrow', 'rgb(167, 34, 34)'],
}

class TopicsStore {
  props: AppProps

  get results() {
    const { setting } = this.props.settingStore
    const topics = setting.values.topTopics || []
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
        <Row key={res.title} {...{ padding: [10, 14] }}>
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

@attach('settingStore', 'paneManagerStore', 'searchStore', 'selectionStore')
@attach({
  store: TopicsStore,
})
@view
export class TopicsApp extends React.Component<AppProps & { store?: TopicsStore }> {
  render() {
    const { results } = this.props.store
    return (
      <ProvideHighlightsContextWithDefaults
        value={{ words: ['app'], maxChars: 500, maxSurroundChars: 80 }}
      >
        <Row>
          <View width="50%">
            <Section padTitle title="Trending" type="search-list">
              <TopicList results={results.slice(0, 10)} />
            </Section>
          </View>
          <View width="50%" borderLeft={[1, [0, 0, 0, 0.1]]}>
            <Section padTitle title="Me" type="search-list">
              <TopicList results={results.slice(10, 20)} />
            </Section>
          </View>
        </Row>
      </ProvideHighlightsContextWithDefaults>
    )
  }
}
