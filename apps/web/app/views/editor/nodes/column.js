import React from 'react'
import { view } from '~/helpers'

@view
export default class Column {
  render({ attributes, children }) {
    return (
      <column {...attributes}>
        {children}
      </column>
    )
  }

  static style = {
    column: {
      border: [1, '#555'],
      flex: 1,
    },
  }
}
