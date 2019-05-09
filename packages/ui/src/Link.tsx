import { gloss } from 'gloss'
import { HTMLProps } from 'react'
import { SimpleText, SimpleTextProps } from './text/SimpleText'

export const Link = gloss<HTMLProps<HTMLLinkElement> & SimpleTextProps & { tagName?: string }>(
  SimpleText,
)

Link.defaultProps = {
  tagName: 'a',
}
