import { gloss } from '@o/gloss'
import { View } from '../View/View'

export const Scrollable = gloss<{ scrollable?: boolean | 'x' | 'y' }>(View, {
  width: '100%',
  height: '100%',
})
