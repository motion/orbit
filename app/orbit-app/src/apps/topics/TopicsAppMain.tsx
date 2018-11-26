import * as React from 'react'
import { AppProps } from '../AppProps'
import { Title } from '../../views'
import { View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'

class TopicsMainStore {
  results = []
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
