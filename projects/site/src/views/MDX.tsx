import { MDXProvider } from '@mdx-js/tag'
import { gloss, Paragraph, Space, Title } from '@o/ui'
import React from 'react'
import { CodeBlock } from './CodeBlock'

export const components = {
  h1: props => (
    <>
      <Title size="xl" {...props} />
      <Space />
    </>
  ),
  h2: props => (
    <>
      <Title size="lg" {...props} />
      <Space />
    </>
  ),
  h3: props => (
    <>
      <Title size="md" {...props} />
      <Space />
    </>
  ),
  h4: props => (
    <>
      <Title size="sm" {...props} />
      <Space />
    </>
  ),
  pre: props => <div {...props} />,
  code: props => (
    <>
      <CodeBlock {...props} />
      <Space />
    </>
  ),
  p: props => (
    <>
      <Paragraph margin={0} {...props} />
      <Space />
    </>
  ),
  inlineCode: props => <InlineCode {...props} />,
}

export function MDX({ children }: any) {
  return <MDXProvider components={components}>{children}</MDXProvider>
}

const InlineCode = gloss({
  display: 'inline-block',
  fontFamily: 'source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace',
  background: '#FDFFD0',
  borderRadius: 4,
  lineHeight: '1.3rem',
  padding: 2,
  margin: [-2, 0],
})
