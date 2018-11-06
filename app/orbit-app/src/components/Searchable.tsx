import * as React from 'react'
import { AppProps } from '../apps/AppProps'
import { Input, View } from '@mcro/ui'
import { ProvideHighlightsContextWithDefaults } from '../helpers/contexts/HighlightsContext'
import { App } from '@mcro/stores'

export function Searchable(props: AppProps & { children: React.ReactNode }) {
  // const { queryStore } = useContext(StoreContext)
  return (
    <>
      <View padding={8}>
        <Input
          hover={false}
          select={false}
          focus={false}
          active={false}
          sizeHeight={0.95}
          placeholder="Search..."
          onChange={props.appStore.queryStore.onChangeQuery}
        />
      </View>
      <ProvideHighlightsContextWithDefaults
        value={{
          words: App.state.query.split(' '),
          maxChars: 500,
          maxSurroundChars: 80,
        }}
      >
        {props.children}
      </ProvideHighlightsContextWithDefaults>
    </>
  )
}
