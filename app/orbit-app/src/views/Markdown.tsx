import { Text } from '@mcro/ui'
import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkEmoji from 'remark-emoji'
import { HighlightText } from './HighlightText'

const ListItem = props => <HighlightText tagName="li" display="list-item" {...props} />
const Code = ({ value, ...props }) => (
  <HighlightText tagName="code" {...props}>
    {value}
  </HighlightText>
)

export const markdownOptions = {
  // use this to highlight search terms more e
  plugins: [remarkEmoji],
  renderers: {
    paragraph: HighlightText,
    listItem: ListItem,
    code: Code,
  },
}

type MarkdownProps = Partial<typeof markdownOptions> & {
  source: string
  className?: string
}

export function Markdown({ className, ...props }: MarkdownProps) {
  return (
    <Text>
      <ReactMarkdown className={`${className} markdown`} {...markdownOptions} {...props} />
    </Text>
  )
}
