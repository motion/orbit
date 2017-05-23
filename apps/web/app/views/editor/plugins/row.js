import { Range } from 'immutable'
import Slate from 'slate'
import { BLOCKS } from '~/views/editor/constants'

function createCol(opts, textGetter) {
  return Slate.Block.create({
    type: opts.typeCol,
  })
}

function createRow(opts, columns, textGetter) {
  const nodes = Range(0, columns)
    .map(i => createCol(opts, textGetter ? textGetter(i) : ''))
    .toList()

  return Slate.Block.create({
    type: opts.typeRow,
    nodes,
  })
}

const plugin = function(opts) {
  return {
    transforms: {
      insertRow(opts, transform, columns = 2) {
        const { state } = transform

        if (!state.selection.startKey) return false

        const row = createRow(opts, columns)

        return transform.insertBlock(row)
      },
    },
  }
}

export default plugin({
  typeCol: BLOCKS.PARAGRAPH,
  typeRow: BLOCKS.ROW,
})
