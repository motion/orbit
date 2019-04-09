import { MDXProvider } from '@mdx-js/tag'
import React from 'react'
import { CodeBlock } from './CodeBlock'

const components = {
  h1: props => <h1 style={{ color: 'tomato' }} {...props} />,
  pre: props => <div {...props} />,
  code: CodeBlock,
}

export function MDX({ children }: any) {
  return <MDXProvider components={components}>{children}</MDXProvider>
}
