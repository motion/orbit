import * as React from 'react'
import { Input, View } from '@mcro/ui'
import { ProvideHighlightsContextWithDefaults } from '../helpers/contexts/HighlightsContext'
import { QueryStore } from '../stores/QueryStore/QueryStore'
import { memo } from '../helpers/memo'

export const Searchable = memo(
  (props: { queryStore: QueryStore; children: React.ReactNode; inputProps?: Object }) => {
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
            words: props.queryStore.query.split(' '),
            maxChars: 500,
            maxSurroundChars: 80,
          }}
        >
          {props.children}
        </ProvideHighlightsContextWithDefaults>
      </>
    )
  },
)
