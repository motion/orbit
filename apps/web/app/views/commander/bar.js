import React from 'react'
import { view } from '@jot/black'
import { Shortcuts } from '~/helpers'
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
          placeholder="url..."
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
      fontSize: 16,
      border: [1, '#ddd'],
      borderRadius: 5,
      margin: 0,
    },
  }
}
