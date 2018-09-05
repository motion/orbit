import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import { markdownOptions } from '../constants/markdownOptions'

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
