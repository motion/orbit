import { Button, Card, gloss, Icon, Row, SimpleText, Space, View } from '@o/ui'
import React, { createElement, isValidElement, memo, useRef, useState } from 'react'
import { useCurrentRoute } from 'react-navi'

import { CodeBlock } from '../../views/CodeBlock'
import { linkProps } from '../HomePage/linkProps'

export type ExampleProps = {
  source: string
  examples: any
  id: string
  name?: string
  children?: any
  willScroll?: boolean
  onlySource?: boolean
  chromeless?: boolean
}

export const Example = memo(
  ({
    source,
    examples,
    parentId,
    id,
    name,
    willScroll,
    onlySource,
    chromeless,
    ...props
  }: ExampleProps) => {
    const route = useCurrentRoute()
    const [showSource, setShowSource] = useState(true)
    const [hovered, setHovered] = useState(false)
    const tm = useRef(null)

    if (!source || !id) {
      return props.children || null
    }

    const exampleElement = isValidElement(examples[id]) ? examples[id] : createElement(examples[id])

    const contents = (
      <>
        {showSource && (
          <SubCard>
            <CodeBlock language="typescript">{parseSource(source, id) || ''}</CodeBlock>
          </SubCard>
        )}

        {!onlySource && (
          <SubCard
            onMouseEnter={() => {
              tm.current = setTimeout(() => setHovered(true), 200)
            }}
            onMouseLeave={() => {
              clearTimeout(tm.current)
              setHovered(false)
            }}
          >
            {exampleElement}
            {willScroll && (
              <AccidentalScrollPrevent disabled={hovered}>
                <View
                  position="absolute"
                  bottom={0}
                  right={0}
                  padding={5}
                  background={theme => theme.backgroundStronger}
                >
                  <SimpleText size={0.8}>Hover to enable</SimpleText>
                </View>
              </AccidentalScrollPrevent>
            )}
          </SubCard>
        )}
      </>
    )

    return (
      <>
        {chromeless ? (
          <>{contents}</>
        ) : (
          <>
            <Space />
            <Card
              elevation={1}
              pad="sm"
              titlePad="sm"
              space
              background={theme => theme.backgroundStrong}
              title={name || id}
              afterTitle={
                <Row space alignItems="center">
                  {parentId && (
                    <Button
                      chromeless
                      size={0.5}
                      sizePadding={0}
                      iconSize={12}
                      icon="share"
                      color={[150, 150, 150, 0.5]}
                      tooltip="Open in own window"
                      {...linkProps(`/docs/isolate/${parentId}/${id}`, { isExternal: true })}
                    />
                  )}
                  <Icon
                    size={16}
                    name="code"
                    color={showSource ? '#B65138' : [150, 150, 150, 0.5]}
                  />
                </Row>
              }
              onClickTitle={() => {
                setShowSource(!showSource)
              }}
            >
              {contents}
            </Card>
            <Space size="xl" />
          </>
        )}
      </>
    )
  },
)

const AccidentalScrollPrevent = gloss({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  // background: [150, 150, 150, 0.025],
  borderRadius: 5,
  zIndex: 10,

  disabled: {
    opacity: 0,
    pointerEvents: 'none',
  },
})

const SubCard = gloss(View, {
  margin: 5,
  borderRadius: 5,
  position: 'relative',
})

function parseSource(source: string, id: string) {
  const blocks = source.split(/\nexport /g)
  const keyBlock = blocks.find(x => x.split('\n')[0].indexOf(id) > -1)
  const allLines = keyBlock.split('\n')
  const lines =
    allLines[0].indexOf(') => {') > -1
      ? // if a component, dont remove first/last line
        allLines
      : // if not a component, remove first/last lines
        indent(allLines.slice(1, allLines.length - 2))
  // remove empty comment line which forces spacing
  const next = lines[0].trim() === '//' ? lines.slice(1, lines.length) : lines
  return next.join('\n')
}

const indent = (lines: string[], space = 0) => {
  const spacePad = lines.reduce((a, b) => Math.min(a, b.search(/\S/)), 100)
  const whiteSpace = [...new Array(space)].map(() => ' ').join('')
  return lines.map(line => `${whiteSpace}${line.slice(spacePad)}`)
}
