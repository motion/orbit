import React from 'react'
import { view } from '@jot/black'
import { Input } from '~/ui'

@view.attach('commanderStore')
@view
export default class CommanderInput {
  render({ commanderStore }) {
    return (
      <bar $$align="center" $$row>
        <Input
          $query
          onChange={commanderStore.onChange}
          onKeyDown={commanderStore.onKeyDown}
          onFocus={commanderStore.onFocus}
          placeholder={commanderStore.place}
          placeholderColor={[0, 0, 0, 0.1]}
          borderColor="transparent"
          padding={[10, 5]}
          height={36}
          getRef={commanderStore.ref('input').set}
          value={commanderStore.value}
        />
      </bar>
    )
  }

  static style = {
    bar: {
      flex: 1,
    },
    query: {
      flex: 1,
      fontSize: 22,
      fontWeight: 300,
      border: [1, 'transparent'],
      borderBottomColor: '#f2f2f2',
      borderRadius: 0,
      margin: 0,
      '&:focus': {
        borderBottomColor: '#000',
      },
    },
  }
}
