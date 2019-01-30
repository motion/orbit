import { gloss } from '../gloss'
import { alphaColor } from '../helpers/alphaColor'
import { propsToTextSize } from '../helpers/propsToTextSize'

export const SimpleText = gloss({
  display: 'contents',
}).theme((props, theme) => {
  const { lineHeight, fontSize } = propsToTextSize(props)
  const color = props.color || theme.color
  return {
    fontSize,
    lineHeight,
    ...alphaColor({ color }, props),
  }
})
