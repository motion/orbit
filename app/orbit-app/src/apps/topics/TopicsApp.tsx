import * as React from 'react'
import { view, attach } from '@mcro/black'
import { PaneManagerStore } from '../../pages/OrbitPage/PaneManagerStore'
import { SearchStore } from '../../stores/SearchStore'
import { SelectionStore } from '../../stores/SelectionStore'
import { ProvideHighlightsContextWithDefaults } from '../../helpers/contexts/HighlightsContext'
import { SettingStore } from '../../stores/SettingStore'
import { View, Row, Text } from '@mcro/ui'
import { Section } from '../../components/Section'
import { Icon } from '../../views/Icon'

type Props = {
  paneManagerStore?: PaneManagerStore
  searchStore?: SearchStore
  selectionStore?: SelectionStore
  settingStore?: SettingStore
}

const icons = {
  0: ['neutral', 'gray'],
  1: ['upArrow', 'green'],
  2: ['downArrow', 'red'],
}

class TopicsStore {
  props: Props

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
      {results.slice(0, 10).map(res => (
        <Row key={res.title} {...{ padding: [10, 14] }}>
          <View flex={1}>
            <Text size={1.2}>{res.title}</Text>
          </View>
          <View paddingRight={10} margin={['auto', 0]}>
            <Icon {...res.iconProps} />
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
export class TopicsApp extends React.Component<Props & { store?: TopicsStore }> {
  render() {
    const { results } = this.props.store
    return (
      <ProvideHighlightsContextWithDefaults
        value={{ words: ['app'], maxChars: 500, maxSurroundChars: 80 }}
      >
        <Row>
          <View width="50%">
            <Section padTitle title="Trending" type="search-list">
              <TopicList results={results} />
            </Section>
          </View>
          <View width="50%">
            <Section padTitle title="Me" type="search-list">
              <TopicList results={results} />
            </Section>
          </View>
        </Row>
      </ProvideHighlightsContextWithDefaults>
    )
  }
}
