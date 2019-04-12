import { MDXProvider } from '@mdx-js/react'
import { gloss, Paragraph, Space, Title } from '@o/ui'
import React from 'react'
import orbitComponents from '../../tmp/components.json'
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
  inlineCode: ({ children, ...props }) => {
    if (typeof children === 'string') {
      const len = children.length
      const end = children.slice(len - 2, len)
      if (children[0] === '<' && end === '/>' && children.length < 100) {
        const displayName = children.slice(1, len - 2).trim()
        const info = orbitComponents.find(x => x.displayName === displayName)
        if (info) {
          return <LinkedInlineCode onClick={() => alert('hi')}>{children}</LinkedInlineCode>
        }
      }
    }
    return <InlineCode {...props}>{children}</InlineCode>
  },
}

export function MDX({ children }: any) {
  return <MDXProvider components={components}>{children}</MDXProvider>
}

const InlineCode = gloss({
  display: 'inline-block',
  fontFamily: 'source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace',
  borderRadius: 3,
  padding: [0, 2],
  margin: [0, 0],
}).theme((_, theme) =>
  theme.background.isDark()
    ? {
        background: '#1A71E399',
        color: [255, 255, 255, 0.8],
      }
    : {
        background: '#FDFFD0',
        color: [0, 0, 0, 0.8],
      },
)

const LinkedInlineCode = gloss(InlineCode, {
  cursor: 'pointer',
}).theme((_, theme) => ({
  '&:hover': {
    color: theme.background.isDark() ? '#fff' : '#000',
  },
}))
