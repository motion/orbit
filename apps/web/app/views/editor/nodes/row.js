import React from 'react'
import { view } from '~/helpers'
import node from '~/views/editor/node'
import { range } from 'lodash'

@node
@view
export default class Row {
  render({ node, attributes, children, ...props }) {
    const rows = node.data.get('rows')

    console.log('rows', rows)

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
