import { ItemPropsContext } from '@mcro/kit'
import { HighlightText, Text } from '@mcro/ui'
import React, { useContext } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkEmoji from 'remark-emoji'

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
  body: string
  className?: string
}

export function Markdown(rawProps: MarkdownProps) {
  const itemProps = useContext(ItemPropsContext)
  const { oneLine, renderText, body, className, ...props } = { ...itemProps, ...rawProps }
  if (renderText) {
    return renderText(body)
  }
  if (oneLine) {
    return <HighlightText ellipse>{body.slice(0, 200)}</HighlightText>
  }
  return (
    <Text>
      <ReactMarkdown className={`${className} markdown`} {...markdownOptions} {...props} />
    </Text>
  )
}
