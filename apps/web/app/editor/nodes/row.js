import React from 'react'
import { view } from '~/helpers'
import node from '~/editor/node'
import { range } from 'lodash'

@node
@view
export default class Row {
  render({ attributes, children }) {
    return (
      <row {...attributes}>
        {children}
      </row>
    )
  }

  static style = {
    row: {
      flexFlow: 'row',
    },
  }
}
