import { gloss } from 'gloss'
import { HTMLProps } from 'react'

import { SimpleText, SimpleTextProps } from './text/SimpleText'

export const Link = gloss<HTMLProps<HTMLLinkElement> & { tagName?: string }, SimpleTextProps>(
  SimpleText,
  {
    tagName: 'a',
  },
)
