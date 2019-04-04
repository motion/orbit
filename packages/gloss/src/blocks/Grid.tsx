import { gloss } from '../gloss'
import { Base, BaseProps } from './Base'

const cssVal = (n: number | string | any) => (typeof n === 'number' ? n + 'px' : n)

export type GridProps = BaseProps & {
  colSpan?: number
  autoFitColumns?: boolean
  autoFitRows?: boolean
}

export const Grid = gloss<GridProps>(Base, {
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
