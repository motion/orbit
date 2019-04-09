import { MDXProvider } from '@mdx-js/tag'
import { Space, Text, Title } from '@o/ui'
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
  pre: props => <div {...props} />,
  code: props => (
    <>
      <CodeBlock {...props} />
      <Space />
    </>
  ),
  p: props => (
    <>
      <Text {...props} />
      <Space />
    </>
  ),
}

export function MDX({ children }: any) {
  return <MDXProvider components={components}>{children}</MDXProvider>
}
