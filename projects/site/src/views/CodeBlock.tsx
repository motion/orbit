import './duotone-dark.css'

import { gloss } from '@o/ui'
import { javascript, tsx } from 'illuminate-js/lib/languages'
import React from 'react'
import { Illuminate } from 'react-Illuminate'

Illuminate.addLanguage('js', javascript)
Illuminate.addLanguage('tsx', tsx)

export function CodeBlock(props) {
  // const language = props.language || 'tsx'
  // console.log('props.language', props.language)
  return (
    <CodeBlockChrome>
      <Illuminate lineNumbers lang="tsx">
        {props.children.trim()}
      </Illuminate>
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
