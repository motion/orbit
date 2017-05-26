import React from 'react'
import { view } from '~/helpers'
import node from '~/editor/node'
import { Icon } from '~/ui'
import { range } from 'lodash'
import { Range } from 'immutable'
import Slate from 'slate'
import { BLOCKS } from '~/editor/constants'

function createCol(opts, text) {
  return Slate.Block.create({
    type: opts.typeCol,
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

function createRow(opts, columns, textGetter) {
  const nodes = Range(0, columns)
    .map(i => createCol(opts, textGetter ? textGetter(i) : 'lorem'))
    .toList()

  return Slate.Block.create({
    type: opts.typeRow,
    nodes,
  })
}

const rowPlugin = function(opts) {
  return {
    transforms: {
      insertRow(transform, { columns = 2, textGetter } = {}) {
        const { state } = transform
        console.log('insertRow', transform, state)

        if (!state.selection.startKey) return false

        const row = createRow(opts, columns, textGetter)

        return transform.insertBlock(row)
      },
    },
  }
}

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
  nodes = {
    [BLOCKS.ROW]: Row,
    [BLOCKS.COLUMN]: Column,
  }
  plugins = [
    rowPlugin({
      typeCol: BLOCKS.COLUMN,
      typeRow: BLOCKS.ROW,
    }),
  ]
}
