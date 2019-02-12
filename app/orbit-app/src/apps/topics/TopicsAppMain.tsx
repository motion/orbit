import { ensure, react } from '@mcro/black'
import { loadMany } from '../../mediator'
import { BitsNearTopicModel } from '@mcro/models'
import { View } from '@mcro/ui'
import { useHook, useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import ScrollableContent from '../../sources/views/layout/ScrollableContent'
import { Title } from '../../views'
import ListItem from '../../views/ListItems/ListItem'
import { AppProps } from '../AppTypes'

class TopicsMainStore {
  props: AppProps
  stores = useHook(useStoresSafe)

  get appConfig() {
    return this.stores.appStore.appConfig
  }

  results = react(
    () => this.appConfig,
    async appConfig => {
      ensure('appConfig', !!appConfig)
      const res = await loadMany(BitsNearTopicModel, {
        args: { topic: appConfig.title, count: 10 },
      })
      return res || []
    },
    {
      defaultValue: [],
    },
  )
}

export default observer(function TopicsAppMain(props: AppProps) {
  const store = useStore(TopicsMainStore, props)

  return (
    <View padding={10} flex={1}>
      <Title>{props.title}</Title>
      <ScrollableContent>
        {store.results.map(bit => (
          <ListItem
            key={bit.id}
            // item={bit}
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
