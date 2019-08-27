import EditTable from 'slate-edit-table'

import { BLOCKS } from '../constants'

export class TablePlugin {
  name = 'table'
  category = 'blocks'
  plugins = [
    EditTable({
      typeTable: BLOCKS.TABLE,
      typeRow: BLOCKS.TABLE_ROW,
      typeCell: BLOCKS.TABLE_CELL,
    }),
  ]
}
