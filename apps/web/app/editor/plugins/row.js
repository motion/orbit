// @flow
import React from 'react'
import { view } from '~/helpers'
import node from '~/editor/node'
import { Icon } from '~/ui'
import { range } from 'lodash'
import { Range } from 'immutable'
import Slate from 'slate'
import { BLOCKS } from '~/editor/constants'

@node
@view
class Column {
  bump = node => {
    this.props.setData(node.data.set('flex', (node.data.get('flex') || 1) + 1))
  }

  render({ node, attributes, children }) {
    const flex = node.data.get('flex') || 1
    console.log('flex', flex)

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
class Row {
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

export default class RowPlugin {
  name = 'row'
  nodes = {
    [BLOCKS.ROW]: Row,
    [BLOCKS.COLUMN]: Column,
  }

  options = {
    typeRow: BLOCKS.ROW,
    typeCol: BLOCKS.COLUMN,
  }

  createCol = text => {
    return Slate.Block.create({
      type: this.options.typeCol,
      nodes: [
        Slate.Raw.deserializeText(
          {
            kind: 'text',
            text,
          },
          { terse: true }
        ),
      ],
    })
  }

  createRow = (columns, textGetter = () => 'lorem') => {
    const nodes = Range(0, columns)
      .map(i => this.createCol(textGetter(i)))
      .toList()

    return Slate.Block.create({
      type: this.options.typeRow,
      nodes,
    })
  }

  insertRow = (transform, { columns = 2, textGetter } = {}) => {
    if (!transform.state.selection.startKey) {
      return false
    }
    const row = this.createRow(columns, textGetter)
    return transform.insertBlock(row)
  }
}
