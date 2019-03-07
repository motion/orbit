import { CSSPropertySetStrict } from '@o/css'
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
    size?: number
    ellipse?: boolean
    alpha?: number
    alphaHover?: number
    children?: any
  } & CSSPropertySetStrict
>({
  display: 'contents',
}).theme((props, theme) => {
  const textProps = propsToTextSize(props)
  const color = props.color || theme.color
  return {
    ...props,
    ...(props.ellipse && ellipseStyle),
    ...textProps,
    ...alphaColor({ color }, props),
  }
})
