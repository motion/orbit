import { gloss } from '../gloss'
import { View } from './View'

const px = (n: number | string) => (typeof n === 'number' ? n + 'px' : n)

export const Grid = gloss(View, {
  display: 'grid',
}).theme(p => ({
  ...(p.span ? { gridColumn: `span ${p.span}` } : null),
  ...(p.align ? { alignItems: p.align } : null),
  gridGap: p.gap,
  gridTemplateColumns: `repeat(auto-fit, minmax(${px(p.width)}, 1fr))`,
}))
