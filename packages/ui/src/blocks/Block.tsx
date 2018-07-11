import { view } from '@mcro/black'
import propStyles from '../helpers/propStyles'
import { View } from './View'

export const Block = view(View, {
  display: 'block',
})

Block.theme = propStyles
