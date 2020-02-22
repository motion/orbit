import { HighlightText } from '@o/ui'
import React, { useContext } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkEmoji from 'remark-emoji'

import { ItemPropsContext, ItemsPropsContextType } from './ItemPropsContext'

const ListItem = (props: any) => <HighlightText tagName="li" display="list-item" {...props} />

const Code = ({ value, ...props }) => (
  <HighlightText background={theme => theme.background.lighten(0.1)} tagName="code" {...props}>
    {value}
  </HighlightText>
)

const markdownOptions = {
  // use this to highlight search terms more e
  plugins: [remarkEmoji],
  renderers: {
    paragraph: props => <HighlightText selectable {...props} />,
    listItem: ListItem,
    code: Code,
  },
}

type MarkdownProps = Partial<ItemsPropsContextType> & {
  plugins?: any[]
  renderers?: any
  source: string
  className?: string
}

export function Markdown(rawProps: MarkdownProps) {
  const itemProps = useContext(ItemPropsContext)
  const { renderText, className, ...props } = { ...itemProps, ...rawProps }
  if (renderText) {
    return renderText(props.source)
  }
  return <ReactMarkdown className={`${className} markdown`} {...markdownOptions} {...props} />
}
