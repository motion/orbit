import * as React from 'react'
import { AppProps } from '../AppProps'
import { Title } from '../../views'
import { View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { react, ensure } from '@mcro/black'
import { BitsNearTopicModel, AppType } from '@mcro/models'
import { loadMany } from '@mcro/model-bridge'
import { OrbitListItem } from '../../views/ListItems/OrbitListItem'
import { ScrollableContent } from '../../sources/views/layout/ScrollableContent'
import { observer } from 'mobx-react-lite'
import { useStoresSafe } from '../../hooks/useStoresSafe'

class TopicsMainStore {
  props: AppProps<AppType.topics>
  stores = useStoresSafe()

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

export const TopicsAppMain = observer((props: AppProps<AppType.topics>) => {
  const store = useStore(TopicsMainStore, props)

  return (
    <View padding={10} flex={1}>
      <Title>{props.title}</Title>
      <ScrollableContent>
        {store.results.map(bit => (
          <OrbitListItem
            key={bit.id}
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
