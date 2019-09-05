import { gloss } from 'gloss'

import { fontFamilyMonospace } from './data/fontFamilyMonospace'

export const Code = gloss('code', {
  whiteSpace: 'pre',
  fontFamily: fontFamilyMonospace,
  userSelect: 'text',
})
