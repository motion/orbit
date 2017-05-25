import { Range } from 'immutable'
import Slate from 'slate'
import { BLOCKS } from '~/views/editor/constants'

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

const plugin = function(opts) {
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

export default plugin({
  typeCol: BLOCKS.COLUMN,
  typeRow: BLOCKS.ROW,
})
