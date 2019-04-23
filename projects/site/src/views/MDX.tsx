import { MDXProvider } from '@mdx-js/react'
import { gloss, Paragraph, Space } from '@o/ui'
import React from 'react'

import componentNames from '../../tmp/componentNames.json'
import { Navigation } from '../SiteRoot'
import { CodeBlock } from './CodeBlock'
import { TitleText } from './TitleText'

export const components = {
  h1: props => (
    <>
      <TitleText size="xl" {...props} />
      <Space />
    </>
  ),
  h2: props => (
    <>
      <TitleText size="lg" {...props} />
      <Space />
    </>
  ),
  h3: props => (
    <>
      <TitleText size="md" {...props} />
      <Space />
    </>
  ),
  h4: props => (
    <>
      <TitleText size="sm" {...props} />
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
  li: props => (
    <>
      <li style={{ marginLeft: 26, '-webkit-font-smoothing': 'auto' }} {...props} />
      <Space size="xs" />
    </>
  ),
  ul: props => (
    <>
      <ul {...props} />
      <Space />
    </>
  ),
  p: props => (
    <>
      <Paragraph
        margin={0}
        fontSize="inherit"
        lineHeight="inherit"
        WebkitFontSmoothing="auto"
        {...props}
      />
      <Space />
    </>
  ),
  description: props => (
    <>
      <Paragraph margin={0} {...props} fontSize="inherit" lineHeight="inherit" />
      <Space />
    </>
  ),
  blockquote: props => (
    <>
      <Paragraph
        fontFamily="GT Eesti"
        padding={[8, 20, 0]}
        margin={20}
        borderLeft={theme => [2, theme.borderColor]}
        fontSize="110%"
        lineHeight="inherit"
        alpha={0.5}
        {...props}
      />
    </>
  ),
  inlineCode: ({ children, ...props }) => {
    if (typeof children === 'string') {
      const len = children.length
      const end = children.slice(len - 2, len)
      if (children[0] === '<' && end === '/>' && children.length < 100) {
        const displayName = children.slice(1, len - 2).trim()
        if (!!componentNames.find(x => x === displayName)) {
          return (
            <LinkedInlineCode
              onClick={() => {
                Navigation.navigate(`/docs/${displayName.toLowerCase().replace(' ', '-')}`)
              }}
            >
              {children}
            </LinkedInlineCode>
          )
        }
      }
    }
    return <InlineCode {...props}>{children}</InlineCode>
  },
}

export function MDX({ children, ...props }: any) {
  return (
    <MDXProvider components={components} {...props}>
      {children}
    </MDXProvider>
  )
}

const InlineCode = gloss({
  fontSize: '90%',
  display: 'inline-block',
  fontFamily: 'source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace',
  borderRadius: 3,
  padding: [0, 2],
  margin: [0, 0],
  lineHeight: '1.4rem',
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
