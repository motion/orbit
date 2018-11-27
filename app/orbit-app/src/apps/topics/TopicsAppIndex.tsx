import * as React from 'react'
import { View, Row, Text, SegmentedRow, Button } from '@mcro/ui'
import { Icon } from '../../views/Icon'
import { AppProps } from '../AppProps'
import { useStore } from '@mcro/use-store'
import { Separator } from '../../views/Separator'
import { TopicEdit } from './TopicEdit'
import { memo } from '../../helpers/memo'
import { view } from '@mcro/black'
import { OrbitListItem } from '../../views/OrbitListItem'
import { VerticalSpace } from '../../views'
import { SliderPane, Slider } from '../../views/Slider'
import { MENU_WIDTH, IS_MENU } from '../../constants'
import { ORBIT_WIDTH } from '@mcro/constants'

const icons = {
  0: ['neutral', 'rgba(180,180,180,0.75)'],
  1: ['upArrow', 'rgb(34, 127, 34)'],
  2: ['downArrow', 'rgb(167, 34, 34)'],
}

class TopicsIndexStore {
  props: AppProps
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

function TopicList({ results }) {
  return (
    <>
      {results.map((res, index) => (
        <OrbitListItem
          key={res.title}
          direct
          appType="topics"
          padding={[4, 11]}
          opacity={0.85}
          {...{ '&:hover': activeStyle }}
          activeStyle={activeStyle}
          index={index}
          appConfig={{
            id: index,
            title: res.title,
            type: 'topics',
          }}
        >
          <Row overflow="hidden">
            <View paddingRight={8} margin={['auto', 0]}>
              <Icon {...res.iconProps} />
            </View>
            <View flex={1} overflow="hidden">
              <Text ellipse size={1.1}>
                {res.title}
              </Text>
            </View>
          </Row>
        </OrbitListItem>
      ))}
    </>
  )
}

const ScrollableContent = view({
  flex: 1,
  overflowY: 'auto',
})

const BorderedButton = props => <Button background="transparent" {...props} />

const buttonProps = (store: TopicsIndexStore, type: string) => {
  return {
    onClick: () => store.setActiveTab(type),
    active: store.activeTab === type,
  }
}

export const TopicsAppIndex = memo((props: AppProps & { store?: TopicsIndexStore }) => {
  const store = useStore(TopicsIndexStore, props)
  return (
    <>
      <Slider
        fixHeightToTallest
        curFrame={store.tabs.indexOf(store.activeTab)}
        frameWidth={IS_MENU ? MENU_WIDTH : ORBIT_WIDTH}
        transition="none"
      >
        <SliderPane>
          {!!store.results.length && (
            <ScrollableContent>
              <Separator>Topics</Separator>
              <TopicList results={store.results.slice(0, 8)} />
            </ScrollableContent>
          )}
          <VerticalSpace />
          {!!store.results.length && (
            <>
              <Separator>Terms</Separator>
              <TopicList results={store.results.slice(0, 8)} />
            </>
          )}
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

      <SidebarBottom>
        <SegmentedRow itemProps={{ width: '33.3%', size: 0.9, sizeHeight: 0.9 }}>
          <BorderedButton {...buttonProps(store, 'trend')}>Trend</BorderedButton>
          <BorderedButton {...buttonProps(store, 'topics')}>Topics</BorderedButton>
          <BorderedButton {...buttonProps(store, 'terms')}>Terms</BorderedButton>
        </SegmentedRow>
      </SidebarBottom>
    </>
  )
})

const SidebarBottom = view({
  padding: 6,
})
