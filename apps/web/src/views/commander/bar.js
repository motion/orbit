import React from 'react'
import { view } from '@mcro/black'
import { Input } from '@mcro/ui'

@view.attach('commanderStore')
@view
export default class CommanderInput {
  render({ commanderStore }) {
    commanderStore.renderIndex
    console.log('render index is', commanderStore.renderIndex)

    return (
      <bar $$align="center" $$row $$flex>
        <content
          $input
          contentEditable={true}
          size={1.1}
          onKeyDown={commanderStore.onKeyDown}
          onKeyUp={commanderStore.onKeyUp}
          onFocus={commanderStore.onFocus}
          placeholder={commanderStore.place}
          placeholderColor={[0, 0, 0, 0.1]}
          borderWidth={0}
          ref={el => {
            if (!commanderStore.input) {
              commanderStore.input = el
            }
          }}
          value={commanderStore.value}
          dangerouslySetInnerHTML={{ __html: commanderStore.pathContent() }}
        />
      </bar>
    )
  }

  static style = {
    bar: {},
    input: {
      width: '100%',
      marginLeft: 10,
      marginTop: 0,
    },
  }
}
