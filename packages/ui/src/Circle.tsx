import { Flex, gloss, propsToStyles } from 'gloss'

import { getSize } from './Sizes'
import { TextSizeProps, textSizeTheme } from './text/textSizeTheme'

export const Circle = gloss<TextSizeProps>(Flex, {
  size: 'md',
  position: 'relative',
  borderRadius: 100000,
  alignItems: 'center',
  justifyContent: 'center',
  userSelect: 'none',
}).theme(
  props => ({
    width: getSize(props.size) * 36,
    height: getSize(props.size) * 36,
    background: props.backgroundStrong,
    borderRadius: props.size,
  }),
  propsToStyles,
  textSizeTheme,
)
