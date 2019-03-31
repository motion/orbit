import { gloss, SimpleText, SimpleTextProps } from '@o/gloss'
import { HTMLProps } from 'react'

export const Link = gloss<HTMLProps<HTMLLinkElement> & SimpleTextProps & { tagName?: string }>(
  SimpleText,
)

Link.defaultProps = {
  tagName: 'a',
}
