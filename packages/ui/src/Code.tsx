import { gloss } from 'gloss'

import { fontFamilyMonospace } from './constants'

export const Code = gloss('code', {
  whiteSpace: 'pre',
  fontFamily: fontFamilyMonospace,
  userSelect: 'text',
})
