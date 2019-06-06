import { gloss } from '../gloss'
import { Base, BaseProps } from './Base'

// TODO
// we need to have gloss resolve themes *before* passing to `.theme`
// so we can use the `px()` function from @o/css.
// also will make types and generally using gloss nicer

const px = (n: number | string | any) => (typeof n === 'number' ? n + 'px' : n)

export type GridProps = BaseProps & {
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
