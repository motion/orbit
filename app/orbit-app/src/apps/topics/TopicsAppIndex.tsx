import * as React from 'react'
import { View, Row, Text, SegmentedRow, Button } from '@mcro/ui'
import { Icon } from '../../views/Icon'
import { AppProps } from '../AppProps'
import { useStore } from '@mcro/use-store'
import { Separator } from '../../views/Separator'
import { TopicEdit } from './TopicEdit'
import ListItem from '../../views/ListItems/ListItem'
import { SliderPane, default as Slider } from '../../views/Slider'
import { IS_MINIMAL } from '../../constants'
import { observer } from 'mobx-react-lite'
import { gloss } from '@mcro/gloss'
import { AppType } from '@mcro/models'

const icons = {
  0: ['neutral', 'rgba(180,180,180,0.75)'],
  1: ['upArrow', 'rgb(34, 127, 34)'],
  2: ['downArrow', 'rgb(167, 34, 34)'],
}

class TopicsIndexStore {
  props: AppProps<AppType.topics>
  activeTab = 'trend'
  tabs = ['trend', 'topics', 'terms']

  setActiveTab = name => {
    this.activeTab = name
  }

  get results() {
    return ['TSNE', 'pundle', 'syncers', 'site', 'design', 'some-really-long-title-goes-here'].map(
      (topic, i) => ({
        title: topic,
        content: 'hello world',
        iconProps: {
          name: icons[i % 3][0],
          size: 9,
          fill: icons[i % 3][1],
        },
      }),
    )
  }
}

const activeStyle = { opacity: 1 }

function TopicList({ results, offset = 0, ...props }) {
  return (
    <>
      {results.map((res, index) => (
        <ListItem
          key={res.title}
          padding={[IS_MINIMAL ? 5 : 7, 11]}
          {...{ '&:hover': activeStyle }}
          activeStyle={activeStyle}
          index={index + offset}
          appConfig={{
            id: res.id,
            title: res.title,
            type: 'topics',
          }}
          {...props}
        >
          <Row overflow="hidden">
            <View paddingRight={8} margin={['auto', 0]}>
              <Icon {...res.iconProps} />
            </View>
            <View flex={1} overflow="hidden">
              <Text ellipse size={1.2}>
                {res.title}
              </Text>
            </View>
          </Row>
        </ListItem>
      ))}
    </>
  )
}

const ScrollableContent = gloss({
  flex: 1,
  overflowY: 'auto',
})

const buttonProps = (store: TopicsIndexStore, type: string) => {
  return {
    onClick: () => store.setActiveTab(type),
    active: store.activeTab === type,
  }
}

const size = IS_MINIMAL ? 0.9 : 0.95

export const TopicsAppIndex = observer(
  (props: AppProps<AppType.topics> & { store?: TopicsIndexStore }) => {
    const store = useStore(TopicsIndexStore, props)
    return (
      <>
        <SegmentedRow
          margin={8}
          itemProps={{ background: 'transparent', width: '33.3%', size, sizeHeight: size }}
        >
          <Button {...buttonProps(store, 'trend')}>Trend</Button>
          <Button {...buttonProps(store, 'topics')}>Topics</Button>
          <Button {...buttonProps(store, 'terms')}>Terms</Button>
        </SegmentedRow>

        <Slider fixHeightToTallest curFrame={store.tabs.indexOf(store.activeTab)} transition="none">
          <SliderPane>
            <ScrollableContent>
              {!!store.results.length && (
                <>
                  <TopicList results={store.results} />
                </>
              )}
            </ScrollableContent>
          </SliderPane>

          <SliderPane>
            <ScrollableContent>
              <TopicList results={store.results} />
            </ScrollableContent>
            <SidebarBottom>
              <TopicEdit type="topic" />
            </SidebarBottom>
          </SliderPane>

          <SliderPane>
            <ScrollableContent>
              <TopicList results={store.results} />
            </ScrollableContent>
            <SidebarBottom>
              <TopicEdit type="term" />
            </SidebarBottom>
          </SliderPane>
        </Slider>
      </>
    )
  },
)

const SidebarBottom = gloss({
  padding: [12, IS_MINIMAL ? 6 : 12],
})
