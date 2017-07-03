import React from 'react'
import { view } from '@mcro/black'
import { Input } from '@mcro/ui'

@view.attach('commanderStore')
@view
export default class CommanderInput {
  render({ commanderStore }) {
    return (
      <bar $$align="center" $$row $$flex>
        <Input
          $input
          size={1.3}
          onChange={commanderStore.onChange}
          onKeyDown={commanderStore.onKeyDown}
          onFocus={commanderStore.onFocus}
          placeholder={commanderStore.place}
          placeholderColor={[0, 0, 0, 0.1]}
          borderRadius={0}
          borderWidth={0}
          borderBottom={[1, '#eee']}
          padding={0}
          getRef={commanderStore.ref('input').set}
          value={commanderStore.value}
        />
      </bar>
    )
  }

  static style = {
    bar: {},
    input: {
      width: '100%',
      marginTop: 0,
    },
  }
}
