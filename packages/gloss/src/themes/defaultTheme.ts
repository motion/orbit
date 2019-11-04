import { toColor } from '@o/color'

import { createTheme } from '../theme/createTheme'

// empty theme for use

export const defaultTheme = createTheme({
  background: toColor('white'),
  color: toColor('black'),
})
