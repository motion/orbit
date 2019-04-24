import { Card, gloss, Icon, SectionProps, Space, View } from '@o/ui'
import React, { useState } from 'react'

import { CodeBlock } from '../../views/CodeBlock'

export function Example({
  source,
  examples,
  id,
  ...props
}: SectionProps & { source: string; examples: any; id: string }) {
  const [showSource, setShowSource] = useState(false)

  if (!source || !id) {
    return props.children || null
  }
  return (
    <>
      <Card
        background={theme => theme.backgroundStrong}
        title={id}
        afterTitle={<Icon size={24} name="code" />}
        onClickTitle={() => {
          setShowSource(!showSource)
        }}
      >
        <SubCard hidden={!showSource}>
          <CodeBlock language="typescript">{parseSource(source, id) || ''}</CodeBlock>
        </SubCard>
        <SubCard>{examples[id]}</SubCard>
      </Card>
      <Space size="xl" />
    </>
  )
}

const SubCard = gloss(View, {
  margin: 5,
  borderRadius: 5,
  overflow: 'hidden',

  hidden: {
    height: 0,
    margin: 0,
  },
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
