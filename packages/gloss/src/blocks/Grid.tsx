import { gloss } from '../gloss'
import { Base } from './Base'

const px = (n: number | string | any) => (typeof n === 'number' ? n + 'px' : n)

export type GridProps = {
  itemMinHeight?: number
  itemMinWidth?: number
  itemMaxWidth?: number
  colSpan?: number
  autoFitColumns?: boolean
  autoFitRows?: boolean
}

export const Grid = gloss<GridProps>(Base, {
  display: 'grid',
}).theme(p => ({
  ...(p.colSpan ? { gridColumn: `span ${p.colSpan}` } : null),
  gridTemplateColumns:
    p.autoFitColumns && `repeat(auto-fit, minmax(${px(p.itemMinWidth || 0)}, 1fr))`,
  gridTemplateRows: p.autoFitRows && `repeat(100000, ${px(p.itemMinHeight || 100)}, [col-start])`,
  ...(!!(p.itemMaxWidth || p.itemMinWidth) && {
    '& > *': {
      minWidth: p.itemMinWidth,
      maxWidth: p.itemMaxWidth,
    },
  }),
  width: 'auto',
  ...p,
}))
