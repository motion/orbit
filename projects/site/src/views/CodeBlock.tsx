import './duotone-dark.css'

import { gloss, useTheme } from '@o/ui'
import Highlight, { defaultProps } from 'prism-react-renderer'
import darkTheme from 'prism-react-renderer/themes/nightOwl'
import React, { memo } from 'react'

// import lightTheme from 'prism-react-renderer/themes/nightOwl'

export const CodeBlock = memo(props => {
  const theme = useTheme()
  // const language = props.language || 'tsx'
  // console.log('props.language', props.language)
  return (
    <CodeBlockChrome>
      <Highlight
        {...defaultProps}
        code={`${props.children}`.trim()}
        language="jsx"
        theme={theme.background.isDark() ? darkTheme : darkTheme}
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
  lineHeight: 18,

  '& span': {
    display: 'inline',
  },
  '& div': {
    display: 'block',
  },
})
