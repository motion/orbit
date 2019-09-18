import { MDXProvider } from '@mdx-js/react'
import { gloss, Paragraph, Space, Tag, View } from '@o/ui'
import React from 'react'

import componentNames from '../../tmp/componentNames.json'
import { fontProps } from '../constants'
import { Navigation } from '../Navigation'
import { Example } from '../pages/DocsPage/Example'
import { linkProps } from '../useLink'
import { CodeBlock } from './CodeBlock'
import { IntroText } from './IntroText'
import { Key } from './Key'
import { TitleText } from './TitleText'

const contentSpaceLg = <Space size="xl" />
const contentSpace = <Space size="lg" />

function getComponents() {
  return {
    // custom
    Tag,
    Example,
    Key,

    IntroText: props => (
      <>
        <IntroText {...props} />
        {contentSpaceLg}
      </>
    ),

    h1: props => (
      <>
        <TitleText size="lg" {...props} />
        {contentSpace}
      </>
    ),
    h2: props => (
      <View>
        {contentSpaceLg}
        <TitleText fontWeight={400} size="sm" {...props} />
        {contentSpace}
      </View>
    ),
    h3: props => (
      <View>
        {contentSpaceLg}
        <TitleText size="xxxs" {...props} />
        {contentSpace}
      </View>
    ),
    h4: props => (
      <View>
        {contentSpaceLg}
        <TitleText size="xxxs" fontWeight={400} alpha={0.6} {...props} />
        {contentSpace}
      </View>
    ),
    pre: props => <div {...props} />,
    code: props => (
      <>
        <CodeBlock {...props} />
        {contentSpace}
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
        {contentSpace}
      </>
    ),

    a: props => {
      const { tagName, ...lp } = linkProps(props.href)
      return <a {...lp} {...props} />
    },

    ol: props => (
      <>
        <ol className="body-text" {...props} />
        {contentSpace}
      </>
    ),
    p: props => {
      return (
        <>
          <Paragraph
            className="body-text"
            margin={0}
            fontSize="inherit"
            lineHeight="inherit"
            color="inherit"
            {...props}
          />
          {contentSpace}
        </>
      )
    },
    description: props => (
      <>
        <Paragraph
          className="body-text"
          margin={0}
          {...props}
          fontSize="inherit"
          lineHeight="inherit"
        />
        {contentSpace}
      </>
    ),
    blockquote: props => (
      <View>
        {contentSpace}
        <Paragraph
          {...fontProps.TitleFont}
          padding={[12, 20, 0]}
          margin={[0, 20]} // top/bottom wont work here
          borderLeft={theme => [2, theme.borderColor]}
          fontSize="110%"
          lineHeight="inherit"
          alpha={0.5}
          {...props}
        />
        {contentSpaceLg}
      </View>
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
}

const components = getComponents()

export function MDX({ children, ...props }: any) {
  return (
    <MDXProvider
      {...props}
      components={props.components ? { ...components, ...props.components } : components}
    >
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
