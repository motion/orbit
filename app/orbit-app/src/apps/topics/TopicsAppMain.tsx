import * as React from 'react'
import { AppProps } from '../AppProps'
import { Title } from '../../views'
import { View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { react } from '@mcro/black'
import { BitsNearTopicModel } from '@mcro/models'
import { loadMany } from '@mcro/model-bridge'
import { OrbitListItem } from '../../views/OrbitListItem'
import { ScrollableContent } from '../../sources/views/layout/ScrollableContent'

class TopicsMainStore {
  props: AppProps

  results = react(
    () => this.props.appStore.appConfig.title,
    async topic => {
      const res = await loadMany(BitsNearTopicModel, {
        args: { topic, count: 10 },
      })
      return res
    },
    {
      defaultValue: [],
    },
  )
}

export const TopicsAppMain = React.memo((props: AppProps) => {
  const store = useStore(TopicsMainStore, props)

  return (
    <View padding={10} flex={1}>
      <Title>{props.title}</Title>
      <ScrollableContent>
        {store.results.map(bit => (
          <OrbitListItem
            key={bit.id}
            appType="bit"
            model={bit}
            margin={0}
            padding={15}
            theme={{
              backgroundHover: 'transparent',
            }}
          />
        ))}
      </ScrollableContent>
    </View>
  )
})
