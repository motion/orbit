import { Card, gloss, Icon, Space, View } from '@o/ui'
import React, { memo, useState } from 'react'

import { CodeBlock } from '../../views/CodeBlock'

export type ExampleProps = {
  source: string
  examples: any
  id: string
  name?: string
  children: any
}

export const Example = memo(({ source, examples, id, name, ...props }: ExampleProps) => {
  const [showSource, setShowSource] = useState(false)

  if (!source || !id) {
    return props.children || null
  }

  console.log('source is', source)

  return (
    <>
      <Space size="sm" />
      <Card
        pad
        space
        background={theme => theme.backgroundStrong}
        title={name || id}
        afterTitle={<Icon size={20} name="code" color="#B65138" />}
        onClickTitle={() => {
          setShowSource(!showSource)
        }}
      >
        {showSource && (
          <SubCard>
            <CodeBlock language="typescript">{parseSource(source, id) || ''}</CodeBlock>
          </SubCard>
        )}
        <SubCard>{examples[id]}</SubCard>
      </Card>
      <Space size="lg" />
    </>
  )
})

const SubCard = gloss(View, {
  margin: 5,
  borderRadius: 5,
})

function parseSource(source: string, id: string) {
  const blocks = source.split(/\nexport /g)
  const keyBlock = blocks.find(x => x.split('\n')[0].indexOf(id) > -1)
  const allLines = keyBlock.split('\n')
  const lines = indent(allLines.slice(1, allLines.length - 2)).join('\n')
  return lines
  //   return `export (
  // ${lines}
  // )`
}

const indent = (lines: string[], space = 0) => {
  const spacePad = lines.reduce((a, b) => Math.min(a, b.search(/\S/)), 100)
  const whiteSpace = [...new Array(space)].map(() => ' ').join('')
  return lines.map(line => `${whiteSpace}${line.slice(spacePad)}`)
}
