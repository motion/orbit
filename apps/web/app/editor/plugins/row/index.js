// @flow
import React from 'react'
import { view } from '~/helpers'
import node from '~/editor/node'
import { Icon } from '~/ui'
import { range } from 'lodash'
import { Range } from 'immutable'
import Slate from 'slate'
import { BLOCKS } from '~/editor/constants'
import { createButton } from './helpers'
import { Column, Row } from './nodes'

const insertRow = (transform, { columns = 2, textGetter } = {}) => {
  if (!transform.state.selection.startKey) {
    return false
  }
  const row = this.createRow(columns, textGetter)
  return transform.insertBlock(row)
}

export default class RowPlugin {
  name = 'row'
  category = 'blocks'

  nodes = {
    [BLOCKS.ROW]: Row,
    [BLOCKS.COLUMN]: Column,
  }

  options = {
    typeRow: BLOCKS.ROW,
    typeCol: BLOCKS.COLUMN,
  }

  barButtons = [
    createButton('row', BLOCKS.ROW, {
      wrap: insertRow,
    }),
  ]

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

  insertRow = insertRow
}
