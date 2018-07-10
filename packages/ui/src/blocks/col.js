import { view } from '@mcro/black'
import propStyles from '../helpers/propStyles'

export const Col = view({
  display: 'flex',
  flexFlow: 'column',
})

Col.theme = propStyles
