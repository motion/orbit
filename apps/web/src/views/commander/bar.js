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
          size={2}
          height={200}
          onChange={commanderStore.onChange}
          onKeyDown={commanderStore.onKeyDown}
          onFocus={commanderStore.onFocus}
          placeholder={commanderStore.place}
          placeholderColor={[0, 0, 0, 0.1]}
          borderColor="transparent"
          getRef={commanderStore.ref('input').set}
          value={commanderStore.value}
        />
      </bar>
    )
  }
}
