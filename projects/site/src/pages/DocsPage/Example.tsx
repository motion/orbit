import { Button, Divider, gloss, Icon, Loading, SimpleText, Space, Stack, useIntersectionObserver, View } from '@o/ui'
import { Box } from 'gloss'
import { capitalize } from 'lodash'
import React, { createElement, isValidElement, memo, Suspense, useRef, useState } from 'react'

import { fontProps, mediaQueries } from '../../constants'
import { linkProps } from '../../useLink'
import { CodeBlock } from '../../views/CodeBlock'
import { H5 } from '../../views/Headings'

export type ExampleProps = {
  source: string
  examples: any
  id: string
  name?: string
  children?: any
  willScroll?: boolean
  onlySource?: boolean
  chromeless?: boolean
  parentId?: string
  sourceBelow?: boolean
  // col props
  pad?: boolean
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
    sourceBelow,
    children,
    ...props
  }: ExampleProps) => {
    // const route = useCurrentRoute()
    const [showSource, setShowSource] = useState(true)
    const [hovered, setHovered] = useState(false)
    const tm = useRef(null)

    if (!source || !id) {
      return children || null
    }

    const exampleElement = isValidElement(examples[id]) ? examples[id] : createElement(examples[id])

    const exampleRef = useRef()
    const [hasIntersected, setHasIntersected] = useState(false)
    useIntersectionObserver({
      disable: hasIntersected,
      ref: exampleRef,
      onChange(entries) {
        if (entries.some(x => x.isIntersecting)) {
          setHasIntersected(true)
        }
      },
    })

    const contents = hasIntersected && (
      <ExampleContainer {...props}>
        {!onlySource && (
          <ExampleHalf
            minHeight={100}
            onMouseEnter={() => {
              tm.current = setTimeout(() => setHovered(true), 150)
            }}
            onMouseMove={() => {
              clearTimeout(tm.current)
              tm.current = setTimeout(() => setHovered(true), 150)
            }}
            onMouseLeave={() => {
              clearTimeout(tm.current)
              setHovered(false)
            }}
          >
            {exampleElement}
            {willScroll && (
              <AccidentalScrollPrevent disallowScroll={hovered}>
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
          </ExampleHalf>
        )}

        {showSource && (
          <ExampleHalf>
            <CodeBlock language="typescript">{parseSource(source, id) || ''}</CodeBlock>
          </ExampleHalf>
        )}
      </ExampleContainer>
    )

    return (
      <Stack className="orbit-example" nodeRef={exampleRef}>
        <Suspense fallback={<Loading />}>
          {chromeless ? (
            <>{contents}</>
          ) : (
            <>
              {/* <Divider /> */}
              <Space size="sm" />
              <Stack direction="horizontal">
                <H5>{name || capitalize(id)}</H5>
                <View flex={1} />
                <Stack direction="horizontal" space alignItems="center">
                  {parentId && (
                    <Button
                      chromeless
                      size={0.5}
                      sizePadding={0}
                      iconSize={12}
                      icon="share"
                      color={[150, 150, 150, 0.5]}
                      tooltip="Open in own window"
                      {...linkProps(`/docs/${parentId}/isolate/${id}`, { isExternal: true })}
                    />
                  )}
                  <Icon
                    size={16}
                    name="code"
                    color={showSource ? '#B65138' : [150, 150, 150, 0.5]}
                    onClick={() => {
                      setShowSource(!showSource)
                    }}
                  />
                </Stack>
              </Stack>
              <Space />
              <View
                {...fontProps.SystemFont}
                //  border={theme => [1, theme.borderColor]}
              >
                {contents}
              </View>
              <Divider />
              <Space size="xl" />
            </>
          )}
        </Suspense>
      </Stack>
    )
  },
)

const AccidentalScrollPrevent = gloss(Box, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: [150, 150, 150, 0.1],
  zIndex: 10,
  conditional: {
    disallowScroll: {
      opacity: 0,
      pointerEvents: 'none',
    },
  },
})

const ExampleContainer = gloss(Stack, {
  [mediaQueries.lg]: {
    display: 'grid',
    columnGap: 20,
    gridTemplateColumns: '1fr 1fr',
  },
})

const ExampleHalf = gloss(Box, {
  position: 'relative',
  marginBottom: 20,
  borderRadius: 6,
  overflow: 'hidden',

  [mediaQueries.lg]: {
    marginBottom: 0,
  },
})

function parseSource(source: string, id: string) {
  const blocks = source.split(/\nexport /g)
  const keyBlock = blocks.find(x => x.split('\n')[0].indexOf(`let ${id}`) > -1)
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
