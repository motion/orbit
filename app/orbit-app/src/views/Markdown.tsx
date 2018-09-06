import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkEmoji from 'gatsby-remark-emoji'
import { HighlightText } from './HighlightText'

export const markdownOptions = {
  // use this to highlight search terms more e
  plugins: [remarkEmoji],
  renderers: {
    paragraph: HighlightText,
  },
}

type MarkdownProps = Partial<typeof markdownOptions> & {
  source: string
  className?: string
}

export const Markdown = ({ className, ...props }: MarkdownProps) => {
  return (
    <ReactMarkdown
      className={`${className} markdown`}
      {...markdownOptions}
      {...props}
    />
  )
}
