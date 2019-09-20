import './duotone-dark.css'

import { gloss, useTheme } from '@o/ui'
import Highlight, { defaultProps } from 'prism-react-renderer'
import darkTheme from 'prism-react-renderer/themes/nightOwl'
import React, { memo } from 'react'

import lightTheme from './lightOwlTheme'

export const CodeBlock = memo((props: { children: string; language?: string }) => {
  const theme = useTheme()
  return (
    <CodeBlockChrome>
      <Highlight
        {...defaultProps}
        code={`${props.children}`.trim()}
        language="jsx"
        theme={theme.background.isDark() ? lightTheme : darkTheme}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </CodeBlockChrome>
  )
})

const CodeBlockChrome = gloss({
  fontSize: 14,
  lineHeight: 20,

  '& span': {
    display: 'inline',
  },
  '& div': {
    display: 'block',
  },
})
