import React from 'react'
import { view } from '~/helpers'
import node from '~/views/editor/node'
import { Icon } from '~/ui'

@node
@view
export default class Column {
  bump = node => {
    this.props.setData(node.data.set('flex', (node.data.get('flex') || 1) + 1))
  }

  render({ node, attributes, children }) {
    const flex = node.data.get('flex') || 1
    console.log('change', onChange)

    return (
      <column $$flex={flex} {...attributes}>
        {children}
        <Icon name="add" onClick={() => this.bump(node)} />
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
