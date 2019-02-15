import { gloss } from '../gloss'
import { View } from './View'

const cssVal = (n: number | string) => (typeof n === 'number' ? n + 'px' : n)

export const Grid = gloss(View, {
  display: 'grid',
}).theme(p => ({
  ...(p.span ? { gridColumn: `span ${p.span}` } : null),
  ...(p.align ? { alignItems: p.align } : null),
  gridGap: p.gap,
  gridTemplateColumns: p.autoFitColumns
    ? `repeat(auto-fit, minmax(${cssVal(p.minWidth || 100)}, ${cssVal(p.maxWidth || '1fr')}))`
    : p.gridTemplateColumns,
  gridTemplateRows: p.autoFitRows
    ? `repeat(100000, ${cssVal(p.minHeight || 100)}, [col-start])`
    : p.gridTemplateRows,
  width: 'auto',
}))
