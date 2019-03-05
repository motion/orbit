import { HighlightOptions } from '@mcro/utils'
import * as React from 'react'
import { MergeContext } from '../helpers/MergeContext'
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
export const HighlightsContext = React.createContext(defaultValue)

export const MergeHighlightsContext = ({ value, children }: MergeHighlightsContextProps) => (
  <MergeContext
    Context={HighlightsContext}
    value={{
      words: [],
      maxSurroundChars: Infinity,
      maxChars: Infinity,
      ...value,
    }}
  >
    {children}
  </MergeContext>
)

export const HighlightText = ({ options, children, ...props }: Props) => {
  let extraProps
  if (typeof props.alpha === 'undefined') {
    extraProps = {
      // inherits parent color for deep nesting
      color: 'inherit',
    }
  }
  return (
    <HighlightsContext.Consumer>
      {options => {
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
      }}
    </HighlightsContext.Consumer>
  )
}
