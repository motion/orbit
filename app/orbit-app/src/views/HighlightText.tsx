import * as React from 'react'
import { Text, TextProps } from '@mcro/ui'
import { HighlightsContext } from '../helpers/contexts/HighlightsContext'
import { HighlightOptions } from '@mcro/helpers'

type Props = TextProps & {
  options?: Partial<HighlightOptions>
}

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
