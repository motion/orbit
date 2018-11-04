import * as React from 'react'
import { AppProps } from '../apps/AppProps'
import { Input } from '@mcro/ui'
import { ProvideHighlightsContextWithDefaults } from '../helpers/contexts/HighlightsContext'
import { App } from '@mcro/stores'

export function Searchable(props: AppProps & { children: React.ReactNode }) {
  // const { queryStore } = useContext(StoreContext)
  return (
    <>
      <Input onChange={props.appStore.queryStore.onChangeQuery} />
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
