import EditTable from 'slate-edit-table'
import { BLOCKS } from '/editor/constants'

export default class TablePlugin {
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
