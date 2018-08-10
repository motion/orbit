import { view } from '@mcro/black'

const height = 70
const gap = 7

export const Grid = view({
  display: 'grid',
  gap,
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  // height of items
  gridAutoRows: height,
  margin: [0, -4],
})
