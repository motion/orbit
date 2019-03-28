import { gloss, SimpleText } from '@o/gloss'
import { SimpleTextProps } from '@o/gloss/_/blocks/SimpleText'
import { HTMLProps } from 'react'

export const Link = gloss<HTMLProps<HTMLLinkElement> & SimpleTextProps & { tagName?: string }>(
  SimpleText,
)

Link.defaultProps = {
  tagName: 'a',
}
