import { MDXProvider } from '@mdx-js/react'
import { gloss, Paragraph, Space, Tag } from '@o/ui'
import React from 'react'

import componentNames from '../../tmp/componentNames.json'
import { linkProps } from '../LinkState'
import { Navigation } from '../Navigation'
import { Example } from '../pages/DocsPage/Example'
import { CodeBlock } from './CodeBlock'
import { IntroText } from './IntroText'
import { Key } from './Key'
import { TitleText } from './TitleText'

export const components = {
  // custom
  Tag,
  Example,
  Key,

  IntroText: props => (
    <>
      <IntroText {...props} />
      <Space size="lg" />
    </>
  ),

  h1: props => (
    <>
      <TitleText size="xl" {...props} />
      <Space />
    </>
  ),
  h2: props => (
    <>
      <TitleText marginTop={16} size="lg" {...props} />
      <Space size="lg" />
    </>
  ),
  h3: props => (
    <>
      <Space />
      <TitleText marginTop={16} size="md" {...props} />
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
      <li style={{ marginLeft: 26 }} {...props} />
      <Space size="sm" />
    </>
  ),
  ul: props => (
    <>
      <ul className="body-text" {...props} />
      <Space />
    </>
  ),

  a: ({ tagName: _ignore, ...props }) => {
    return <a {...linkProps(props.href)} {...props} />
  },

  ol: props => (
    <>
      <ol className="body-text" {...props} />
      <Space />
    </>
  ),
  p: props => (
    <>
      <Paragraph
        className="body-text"
        margin={0}
        fontSize="inherit"
        lineHeight="inherit"
        color="inherit"
        {...props}
      />
      <Space />
    </>
  ),
  description: props => (
    <>
      <Paragraph
        className="body-text"
        margin={0}
        {...props}
        fontSize="inherit"
        lineHeight="inherit"
      />
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
    <MDXProvider {...props} components={{ ...components, ...props.components }}>
      {children}
    </MDXProvider>
  )
}

const InlineCode = gloss({
  display: 'inline-block',
  fontFamily: `Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace`,
  borderRadius: 3,
  padding: [0, 2],
  margin: 0,
  lineHeight: '1.4rem',
  fontWeight: 400,
  fontSize: '80%',
}).theme((_, theme) =>
  theme.background.isDark()
    ? {
        background: '#1A71E399',
        color: [255, 255, 255, 0.8],
      }
    : {
        background: '#efefef',
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
