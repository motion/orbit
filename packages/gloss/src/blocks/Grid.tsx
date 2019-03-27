import { gloss } from '../gloss'
import { View, ViewProps } from './View'

const cssVal = (n: number | string) => (typeof n === 'number' ? n + 'px' : n)

export type GridProps = ViewProps & {
  colSpan?: number
  autoFitColumns?: boolean
  autoFitRows?: boolean
}

export const Grid = gloss<GridProps>(View, {
  display: 'grid',
}).theme(p => ({
  ...(p.colSpan ? { gridColumn: `span ${p.colSpan}` } : null),
  gridTemplateColumns:
    p.autoFitColumns &&
    `repeat(auto-fit, minmax(${cssVal(p.minWidth || 100)}, ${cssVal(p.maxWidth || '1fr')}))`,
  gridTemplateRows: p.autoFitRows && `repeat(100000, ${cssVal(p.minHeight || 100)}, [col-start])`,
  width: 'auto',
  ...p,
}))
