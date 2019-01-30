import { CSSPropertySetStrict } from '@mcro/css'
import { gloss } from '../gloss'
import { alphaColor } from '../helpers/alphaColor'
import { propsToTextSize } from '../helpers/propsToTextSize'

const ellipseStyle = {
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

export const SimpleText = gloss<
  {
    ellipse?: boolean
    alpha?: number
    alphaHover?: number
    children?: any
  } & CSSPropertySetStrict
>({
  display: 'contents',
}).theme((props, theme) => {
  const { lineHeight, fontSize } = propsToTextSize(props)
  const color = props.color || theme.color
  return {
    ...props,
    ...(props.ellipse && ellipseStyle),
    fontSize,
    lineHeight,
    ...alphaColor({ color }, props),
  }
})
