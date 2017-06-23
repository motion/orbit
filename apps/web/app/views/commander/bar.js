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
          onFocus={commanderStore.open}
          borderColor="transparent"
          placeholder={commanderStore.place}
          placeholderColor={[0, 0, 0, 0.1]}
          height={34}
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
      fontSize: 18,
      fontWeight: 600,
      border: [1, 'transparent'],
      borderRadius: 0,
      margin: 0,
      borderBottom: [2, '#f2f2f2'],
    },
  }
}
