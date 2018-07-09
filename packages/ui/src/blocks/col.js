import { view } from '@mcro/black'
import propStyles from '../helpers/propStyles'

export const Col = view({
  display: 'flex',
  flexFlow: 'row',
})

Col.theme = propStyles
