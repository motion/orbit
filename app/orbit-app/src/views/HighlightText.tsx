import * as React from 'react'
import { Text, TextProps } from '@mcro/ui'
import { HighlightsContext } from '../helpers/contexts/HighlightsContext'
import { HighlightOptions } from '@mcro/ui'

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
        return (
          <Text
            tagName="div"
            className="paragraph"
            display="block"
            selectable
            {...extraProps}
            highlight={
              options.words.length > 1 ||
              // avoid too short of words
              (options.words[0] && options.words[0].length > 1)
                ? options
                : null
            }
            {...props}
          >
            {children}
          </Text>
        )
      }}
    </HighlightsContext.Consumer>
  )
}
