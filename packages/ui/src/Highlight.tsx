import { createStoreContext } from '@o/use-store'
import React, { useMemo } from 'react'

import { useDebounceValue } from './hooks/useDebounce'
import { Text, TextProps } from './text/Text'
import { HighlightOptions } from '@o/utils'

export type HighlightQueryProps = {
  words?: string[]
  maxSurroundChars?: number
  maxChars?: number
}

const defaultState: HighlightQueryProps = {
  words: [] as string[],
  maxSurroundChars: Infinity,
  maxChars: Infinity,
}

class HighlightQueryStore {
  props: HighlightQueryProps

  get state() {
    return Object.assign(defaultState, this.props)
  }
}

const HighlightQueryStoreContext = createStoreContext(HighlightQueryStore)

export type ProvideHighlightProps = HighlightQueryProps & { children?: React.ReactNode }

export const ProvideHighlight = ({ children, ...props }: ProvideHighlightProps) => {
  const valueDebounced = useDebounceValue(JSON.stringify(props), 200)
  const value = useMemo(() => props, [valueDebounced])
  return (
    <HighlightQueryStoreContext.Provider {...value}>{children}</HighlightQueryStoreContext.Provider>
  )
}

export type HighlightTextProps = TextProps & HighlightQueryProps

export function HighlightText({
  children,
  words,
  maxSurroundChars,
  maxChars,
  ...props
}: HighlightTextProps) {
  const { state } = HighlightQueryStoreContext.useStore()
  const text =
    state.words &&
    (state.words.length > 1 ||
      // avoid too short of words
      (state.words[0] && state.words[0].length > 1))
      ? state.words.join(' ')
      : ''
  const highlight: HighlightOptions = useMemo(
    () => ({
      maxSurroundChars: maxSurroundChars || state.maxSurroundChars,
      maxChars: maxChars || state.maxChars,
      words: words || state.words,
      text,
    }),
    [state.maxSurroundChars, state.maxChars, text, words, maxSurroundChars, maxChars],
  )
  return (
    <Text tagName="div" className="paragraph" display="block" highlight={highlight} {...props}>
      {children}
    </Text>
  )
}
