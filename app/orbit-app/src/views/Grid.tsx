import { view } from '@mcro/black'

const height = 77
const gap = 10

export const Grid = view({
  display: 'grid',
  gap,
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  // height of items
  gridAutoRows: height,
  margin: [0, -4],
})
