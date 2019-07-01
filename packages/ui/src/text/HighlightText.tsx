import { HighlightOptions } from '@o/utils'
import React, { createContext, useContext, useMemo } from 'react'

import { MergeContext } from '../helpers/MergeContext'
import { useDebounceValue } from '../hooks/useDebounce'
import { Text, TextProps } from '../text/Text'

type Props = TextProps & {
  options?: Partial<HighlightOptions>
}

const defaultValue = {
  words: [] as string[],
  maxSurroundChars: Infinity,
  maxChars: Infinity,
}

export type HighlightsContextValue = typeof defaultValue
export type MergeHighlightsContextProps = {
  value: Partial<HighlightsContextValue>
  children: any
}
export const HighlightsContext = createContext(defaultValue)

export const HighlightProvide = (props: MergeHighlightsContextProps) => {
  // debounce this because its perf sensitive
  const valueDebounced = useDebounceValue(props.value, 200)
  const value = useMemo(
    () => ({
      words: [],
      maxSurroundChars: Infinity,
      maxChars: Infinity,
      ...valueDebounced,
    }),
    [valueDebounced],
  )

  return (
    <MergeContext Context={HighlightsContext} value={value}>
      {props.children}
    </MergeContext>
  )
}

export function HighlightText({ children, ...props }: Props) {
  const options = useContext(HighlightsContext)
  let extraProps
  if (typeof props.alpha === 'undefined') {
    extraProps = {
      // inherits parent color for deep nesting
      color: 'inherit',
    }
  }
  const highlight =
    options.words &&
    (options.words.length > 1 ||
      // avoid too short of words
      (options.words[0] && options.words[0].length > 1))
      ? options
      : null
  return (
    <Text
      tagName="div"
      className="paragraph"
      display="block"
      {...extraProps}
      highlight={highlight}
      {...props}
    >
      {children}
    </Text>
  )
}
