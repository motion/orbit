// @flow
import React from 'react'
import { view } from '~/helpers'
import node from '~/editor/node'
import { Icon } from '~/ui'

@node
@view
export class Column {
  bump = node => {
    this.props.setData(node.data.set('flex', (node.data.get('flex') || 1) + 1))
  }

  render({ node, attributes, children }) {
    const flex = node.data.get('flex') || 1

    return (
      <column $$flex={flex} {...attributes}>
        {children}
        <Icon
          $icon
          name="expand"
          onClick={() => this.bump(node)}
          size={10}
          color={[0, 0, 0, 0.6]}
        />
      </column>
    )
  }

  static style = {
    column: {
      flex: 1,
      position: 'relative',
    },
    icon: {
      position: 'absolute',
      top: '50%',
      marginTop: -5,
      right: 0,
      bottom: 0,
      cursor: 'default',
      opacity: 0.3,
      '&:hover': {
        opacity: 1,
      },
    },
  }
}

@node
@view
export class Row {
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
