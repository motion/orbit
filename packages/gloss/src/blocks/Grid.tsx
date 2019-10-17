import { gloss } from '../gloss'
import { GlossProps } from '../types'
import { Flex, FlexProps } from './Flex'

const px = (n: number | string | any) => (typeof n === 'number' ? n + 'px' : n)

type GridPropsInner = {
  itemMinHeight?: number
  itemMinWidth?: number
  itemMaxWidth?: number
  colSpan?: number
  autoFitColumns?: boolean
  autoFitRows?: boolean
}

export type GridProps = GlossProps<FlexProps & GridPropsInner>

export const Grid = gloss<GridPropsInner, FlexProps>(Flex, {
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
