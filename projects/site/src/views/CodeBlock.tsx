import './duotone-dark.css'

import { gloss } from '@o/ui'
import { Box } from 'gloss'
import Highlight, { defaultProps } from 'prism-react-renderer'
import darkTheme from 'prism-react-renderer/themes/nightOwl'
import React, { memo } from 'react'

export const CodeBlock = memo((props: { children: string; language?: string }) => {
  return (
    <CodeBlockChrome>
      <Highlight
        {...defaultProps}
        code={`${props.children}`.trim()}
        language="jsx"
        // theme={theme.background.isDark() ? lightTheme : darkTheme}
        theme={darkTheme}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={{ borderRadius: 8, ...style }}>
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

const CodeBlockChrome = gloss(Box, {
  flex: 1,
  fontSize: 14,
  lineHeight: 20,

  '& span': {
    display: 'inline',
  },
  '& div': {
    display: 'block',
  },
})
