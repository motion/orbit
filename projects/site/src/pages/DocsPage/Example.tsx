import { Section, SectionProps, Space } from '@o/ui'
import React from 'react'

import { CodeBlock } from '../../views/CodeBlock'

export function Example({
  source,
  examples,
  id,
  ...props
}: SectionProps & { source: string; examples: any; id: string }) {
  console.log(source, id)
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
  const lines = removeIndent(allLines.slice(1, allLines.length - 2))
  return lines.join('\n')
}

const removeIndent = (lines: string[]) => {
  const spacePad = lines.reduce((a, b) => Math.min(a, b.search(/\S/)), 100)
  return lines.map(line => line.slice(spacePad))
}
