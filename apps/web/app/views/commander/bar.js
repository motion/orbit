import React from 'react'
import { view } from '@jot/black'
import { Shortcuts } from '~/helpers'
import { Input } from '~/ui'

@view.attach('commanderStore')
@view
export default class CommanderInput {
  render({ commanderStore }) {
    return (
      <Shortcuts name="all" handler={commanderStore.onShortcut}>
        <bar $$align="center" $$row>
          <Input
            onChange={commanderStore.setPath}
            onKeyDown={commanderStore.onKeyDown}
            onFocus={commanderStore.onOpen}
            borderColor="transparent"
            fontSize={18}
            placeholder="url..."
          />
        </bar>
      </Shortcuts>
    )
  }

  static style = {
    bar: {
      marginTop: 3,
      marginLeft: -1,
    },
    query: {
      flex: 1,
      fontSize: 16,
    },
  }
}
