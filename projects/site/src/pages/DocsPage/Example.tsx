import { Section, SectionProps, Space } from '@o/ui'
import React from 'react'

import { CodeBlock } from '../../views/CodeBlock'

export function Example({
  source,
  examples,
  id,
  ...props
}: SectionProps & { source: string; examples: any; id: string }) {
  if (!source || !id) {
    return props.children || null
  }
  return (
    <>
      <Section space {...props}>
        {examples[id]}
      </Section>
      <Space />
      <Section>
        <CodeBlock language="typescript">{parseSource(source, id) || ''}</CodeBlock>
      </Section>
      <Space size="xl" />
    </>
  )
}

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
