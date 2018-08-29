import { view } from '@mcro/black'
import { View } from '@mcro/ui'

const height = 70
const gridGap = 8

export const Grid = view(View, {
  display: 'grid',
  gridGap,
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  // height of items
  gridAutoRows: height,
  margin: [0, -4],
})
