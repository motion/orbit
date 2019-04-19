import { gloss } from '@o/ui'
import Highlight, { defaultProps } from 'prism-react-renderer'
import React from 'react'

export function CodeBlock(props) {
  const language = props.className.replace('language-', '')
  return (
    <CodeBlockChrome>
      <Highlight {...defaultProps} code={props.children.trim()} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={{ ...style, padding: '20px' }}>
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
}

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
