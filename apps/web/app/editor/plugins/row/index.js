import React from 'react'
import { view } from '@jot/black'
import node from '~/editor/node'
import { Icon } from '~/ui'
import { range } from 'lodash'
import { Range } from 'immutable'
import Slate from 'slate'
import { BLOCKS } from '~/editor/constants'
import { createButton } from '../helpers'
import { Column, Row } from './nodes'

const DEFAULT_TEXT_GETTER = () => 'lorem'

const createCol = (text, options) => {
  return Slate.Block.create({
    type: options.typeCol,
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

const createRow = (
  columns,
  { textGetter = DEFAULT_TEXT_GETTER, ...options }
) => {
  const nodes = Range(0, columns)
    .map(i => createCol(textGetter(i), options))
    .toList()

  return Slate.Block.create({
    type: options.typeRow,
    nodes,
  })
}

const createInsertRow = options => (transform, { columns = 2 } = {}) => {
  if (!transform.state.selection.startKey) {
    return false
  }
  const row = createRow(columns, options)
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

  // barButtons = [
  //   createButton({
  //     icon: 'row',
  //     tooltip: 'Row',
  //     type: BLOCKS.ROW,
  //     wrap: t => this.insertRow(t),
  //   }),
  // ]

  createCol = createCol
  createRow = createRow
  insertRow = createInsertRow(this.options)
}
