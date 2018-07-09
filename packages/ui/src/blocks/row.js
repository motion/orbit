import { view } from '@mcro/black'
import propStyles from '../helpers/propStyles'

export const Row = view({
  display: 'flex',
  flexFlow: 'row',
})

Row.theme = propStyles
