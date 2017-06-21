import React from 'react'
import { view } from '@jot/black'

const Input = props =>
  <input
    $$style={{
      border: 'none',
      cursor: 'text',
      margin: ['auto', 0],
      padding: [8, 10],
      fontSize: 16,
      opacity: 0.8,
      '&:hover': {
        opacity: 1,
      },
      '&:focus': {
        opacity: 1,
      },
    }}
    {...props}
  />

@view.attach('commanderStore')
@view
export default class CommanderInput {
  render({ commanderStore }) {
    return (
      <bar $$align="center" $$row>
        <SearchIcon />
        <Input
          if={!commanderStore.isOpen}
          onFocus={commanderStore.onOpen}
          $$style={{ fontWeight: 200 }}
          transparent
          fontSize={33}
          height={56}
          flex="none"
        />
      </bar>
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
