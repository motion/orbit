import * as React from 'react'
import { AppProps } from '../AppProps'
import { Title } from '../../views'
import { View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { react } from '@mcro/black'
import { BitsNearTopicModel } from '@mcro/models'
import { loadMany } from '@mcro/model-bridge'

class TopicsMainStore {
  props: AppProps

  results = react(
    async () => {
      const res = await loadMany(BitsNearTopicModel, {
        args: { topic: this.props.appStore.appConfig.title, count: 10 },
      })
      return res
    },
    _ => _,
    {
      defaultValue: [],
    },
  )
}

export const TopicsAppMain = React.memo((props: AppProps) => {
  const store = useStore(TopicsMainStore, props)

  return (
    <View padding={10}>
      <Title>{props.title}</Title>
      hi topics app {props.id} {props.type}
      {store.results.map(result => (
        <div key={result.id}>{result.title}</div>
      ))}
    </View>
  )
})
