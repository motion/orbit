import * as React from 'react'
import { Input, View } from '@mcro/ui'
import { ProvideHighlightsContextWithDefaults } from '../helpers/contexts/HighlightsContext'
import { App } from '@mcro/stores'

export function Searchable(props: { children: React.ReactNode; inputProps?: Object }) {
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
          {...props.inputProps}
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
